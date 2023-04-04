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