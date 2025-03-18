function getPermittedFields(entity:string,action:'create'|'update'){

  const permittedData={
    category:{
      create:['name','description','backgroundImage'],
      update:['name','description','backgroundImage'],
    },
    availability:{
      create:['startTime','endTime','price','description','meetingDetails'],
      update:['startTime','endTime','price','description','meetingDetails'],
    },
    coach:{
      create:['category','motto','description'],
      update:['category','motto','description'],
    }
  }
  //@ts-ignore
  return(permittedData[entity]?.[action]);

}
export {getPermittedFields}
