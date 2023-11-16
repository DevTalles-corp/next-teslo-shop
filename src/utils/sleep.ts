


export const sleep = (seconds: number = 1) => {

  return new Promise( resolve => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000 );
  })


}