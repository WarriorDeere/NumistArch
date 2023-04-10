import { build } from "./build.js";
import { menu } from "./menu.js";

const openMenuBtn = document.querySelector('#open-new-menu');

openMenuBtn.addEventListener('click', async () => {
    await menu.addContent(
        {
            cancel: 'cancel',
            create: 'create'
        },
        {
            add: true
        }
    ).then((r) => {
        menu.open(r);
    });
})

// const openFileAPI = document.querySelector('#help');

// openFileAPI.addEventListener('click', async () => {

// })

// build.newCollection(undefined, 'load');
// build.newAlbum(undefined, 'load');