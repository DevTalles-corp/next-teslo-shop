import { initialData } from './seed';




async function main() {


  console.log(initialData);

  



  console.log('Seed ejecutado correctamente');
}









(() => {

  if (process.env.NODE_ENV === 'production') return;


  main();
})();