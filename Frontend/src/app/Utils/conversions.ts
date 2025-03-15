function formatTime(isoString: string): string {
  let isoHour = isoString.split('T')[1];
  isoString = isoString.split('T')[0];

  const formattedOutPut=isoString+'-'+isoHour.split('.')[0];

  try {
    const date = new Date(formattedOutPut);

    return formattedOutPut;
  } catch (e) {
    return isoString;
  }
}export {formatTime}
