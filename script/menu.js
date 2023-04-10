import { build } from "./build.js";

class MENU {

    constructor() {
        this.menuContainer = document.querySelector('#menu-area');
        this.menuBone = document.createElement('dialog');

        this.menuBone.classList.add('menu');
        this.menuUUID = crypto.randomUUID();
        this.menuBone.id = this.menuUUID;
    }

    async open(modal) {
        const dialog = document.getElementById(modal);
        dialog.showModal();
        this.menuContainer.classList.add('menu-open');
    }

    async addContent(interfaceIDs, closeAction) {

        this.menuBone.innerHTML = `
                <div class="menu-content">
                    <div class="header">
                        <h3>Create new</h3>
                    </div>
                    <menu class="selection" id="options-${this.menuUUID}">
                        <div class="progress">
                            <p id="progress-${this.menuUUID}">Create new</p>
                        </div>
                        <div role="option" class="selection-item" id="option-a-${this.menuUUID}">
                            <i class="bi bi-book"></i>
                            <p>Collection</p>
                        </div>
                        <div role="option" class="selection-item" id="option-b-${this.menuUUID}">
                            <i class="bi bi-journals"></i>
                            <p>Album</p>
                        </div>
                    </menu>
                </div>
                <div class="menu-interface" id="interface-${this.menuUUID}">
                    <button id="${interfaceIDs.cancel}-${this.menuUUID}" class="menu-interface-btn btn-cancel">cancel</button>
                    <button id="${interfaceIDs.create}-${this.menuUUID}" class="menu-interface-btn btn-save" disabled>next</button>
                </div>
        `;

        this.menuContainer.appendChild(this.menuBone);

        const selectionContainer = document.querySelector(`#options-${this.menuUUID}`);

        for (let i = 0; i < selectionContainer.children.length; i++) {
            const element = selectionContainer.children[i];
            if (element.classList.contains('selection-item')) {
                element.addEventListener('click', () => {
                    for (let s = 0; s < selectionContainer.children.length; s++) {
                        const selection = selectionContainer.children[s];
                        selection.classList.remove('item-selected');
                    }
                    element.classList.add('item-selected');

                    const nextBtn = document.getElementById(`${interfaceIDs.create}-${this.menuUUID}`);
                    nextBtn.disabled = false;

                    nextBtn.addEventListener('click', async () => {
                        await this.setMenu(
                            {
                                type: 'userInput',
                                detail: {
                                    selectedOption: element.id
                                },
                                contentArea: `options-${this.menuUUID}`
                            },
                            {
                                uiArea: `interface-${this.menuUUID}`,
                                addDefaultBtnSet: true,
                                finishBtn: 'save',
                                onNext: 'close'
                            }
                        ).catch((err) => {
                            throw new Error(err);
                        });
                    });
                });
            }
        }


        if (closeAction.add) {
            const dialog = document.getElementById(this.menuUUID);
            const closeBtn = document.querySelector(`#${interfaceIDs.cancel}-${this.menuUUID}`);

            closeBtn.addEventListener('click', () => {
                dialog.close();
                this.menuContainer.classList.remove('menu-open');
            });

            dialog.addEventListener('close', () => {
                dialog.remove();
                this.menuContainer.classList.remove('menu-open');
            });
        }

        return this.menuBone.id;
    }

    async setMenu(content, ui) {
        const menuContainer = document.getElementById(content.contentArea);
        const interfaceContainer = document.getElementById(ui.uiArea);

        let finalStr;
        const selectedOptionStr = content.detail.selectedOption
        const selectedOptionShort = selectedOptionStr.substring(7, 8)

        switch (content.type) {
            case 'userInput':
                switch (selectedOptionShort) {
                    case 'a':
                        finalStr = 'Collection';
                        break;

                    case 'b':
                        finalStr = 'Album';
                        break;
                }

                menuContainer.innerHTML = `
                    <div class="progress">
                        <p>Create new ${finalStr} with Name</p>
                    </div>
                    <div class="menu-input">
                        <p>Name your new ${finalStr}</p>
                        <input type="text" id="name-${this.menuUUID}" value="">
                    </div>
                `;
                break;
        }

        if (ui.addDefaultBtnSet) {
            interfaceContainer.innerHTML = `
                <button id="cancel-${this.menuUUID}" class="menu-interface-btn btn-cancel">cancel</button>
                <button id="${ui.finishBtn}-${this.menuUUID}" class="menu-interface-btn btn-save">${ui.finishBtn}</button>
            `;
        }

        if (ui.onNext === 'close') {
            const saveBtn = document.getElementById(`${ui.finishBtn}-${this.menuUUID}`);
            const dialog = document.getElementById(this.menuUUID);

            let elementName;

            const inputField = document.getElementById(`name-${this.menuUUID}`);
            let nameInput;

            inputField.addEventListener('input', () => {
                nameInput = inputField.value;
            })

            saveBtn.addEventListener('click', async () => {
                if (nameInput.trim() === '') {
                    alert('Invalid Name!');
                }
                else {
                    elementName = nameInput.trim();

                    const rawInput = {
                        uuid: this.menuUUID,
                        metadata: {
                            name: elementName,
                            editTimestamp: Date.now(),
                            description: 'Description',
                            icon: 'https://images.pexels.com/photos/157520/pexels-photo-157520.jpeg?auto=compress&cs=tinysrgb&w=1600'
                        }
                    }

                    switch (finalStr) {
                        case 'Collection':
                            await build.newCollection(rawInput, 'set')
                                .then(() => {
                                    dialog.close();
                                    this.menuContainer.classList.remove('menu-open');
                                    // location.reload();
                                }).catch((err) => {
                                    throw new Error(err);
                                });
                        break;

                        case 'Album':
                            await build.newAlbum(rawInput ,'set')
                            .then(() => {
                                dialog.close();
                                this.menuContainer.classList.remove('menu-open');
                                // location.reload();
                            }).catch((err) => {
                                throw new Error(err);
                            });
                        break;
                    }
                }
            })
        }
    }
}

export const menu = new MENU();