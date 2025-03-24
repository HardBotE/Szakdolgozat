import  {NextFunction,Request,Response} from "express";
import SessionModel from "../Model/sessionModel";
import {AppError} from "../Utils/AppError";
import AvailabilityModel from "../Model/availabilityModel";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const payment = async function (req: Request, res: Response, next: NextFunction) {
    console.log('🟢 You are in payment');

    try {
        const sessionDetails = await SessionModel.findById(req.params.id);
        if (!sessionDetails) {
            return next(new AppError("Session not found", 404));
        }

        const availability = await AvailabilityModel.findOne({
            coach_Id: sessionDetails.coach_id,
            day: sessionDetails.date.day,
            startTime: sessionDetails.date.startTime,
            endTime: sessionDetails.date.endTime,
        });

        if (!availability) {
            return next(new AppError("Availability not found", 404));
        }

        const price = availability?.price || 20;

        if (!price || price < 0) {
            return next(new AppError("Please enter a valid price", 400));
        }

        console.log("✅ Session details found, proceeding with Stripe payment...");

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Stripe API Timeout")), 10000) // 10 sec timeout
        );

        const session = await Promise.race([
            stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                currency: "usd",
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: 'payment'
                            },
                            unit_amount: price * 100
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: 'http://localhost:4200/payment_success',
                cancel_url: 'http://localhost:4200/payment_failed'
            }),
            timeout
        ]).catch(err => {
            console.error("❌ Stripe API timeout or error:", err);
            return next(new AppError('Payment failed due to timeout', 504));
        });

        if (!session) {
            console.error("❌ Session creation failed");
            return next(new AppError("Failed to create payment session", 500));
        }

        console.log("✅ Payment session created successfully:", session);

        res.status(200).json({
            status: 'success',
            paymentUrl: session.url,
            session
        });

    } catch (err) {
        console.error("❌ Payment error:", err);
        return next(new AppError('Payment failed', 500));
    }
};

const checkPayment = async function (req: Request, res: Response, next: NextFunction) {

    console.log('Check Payment')

    try {
        const sessionId = req.body.sessionId as string;

        if (!sessionId) {
            return next(new Error("Session ID is required"));
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(session.payment_status);
        if (session.payment_status === "paid") {

            await updateDatabaseAfterPayment(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Payment completed successfully",
                session,
            });
        }

        res.status(200).json({
            success: false,
            message: "Payment is not completed yet",
            session,
        });
    } catch (err) {
        next(err);
    }
};

async function updateDatabaseAfterPayment(sessionId: string) {
    console.log(`Updating database for successful payment: ${sessionId}`);

    await SessionModel.findByIdAndUpdate(sessionId, {status:"paid"},{new:true});


}


export {payment,checkPayment};