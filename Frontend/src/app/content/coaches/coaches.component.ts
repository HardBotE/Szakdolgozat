import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-coaches',
  imports: [],
  templateUrl: './coaches.component.html',
  standalone: true,
  styleUrl: './coaches.component.css'
})
export class CoachesComponent implements OnInit{
  constructor(private route:ActivatedRoute,private http:HttpClient) {
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    let data:any=this.http.get(`http://localhost:3000/api/categories/${id}/coaches`).subscribe(res=>{
      console.log(res);
    })
    console.log('Current ID:', id);

  }
}
//Template uploadra,modyfyra, delete gombra// onnantol route hivogatas az a resze
//Fix images & profile pages (addig default img lesz mindenhol)
//Coaches list with profile pictures, coach reservation with availability
//Session & payment
