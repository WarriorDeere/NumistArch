class BUILD {

    constructor() {
        this.elementUUID = crypto.randomUUID();
        this.collectionContainer = document.querySelector('#content-area');
        this.db = window.indexedDB.open('content', 3);
    }

    async newCollection(element, action) {

        switch (action) {
            case 'load':

                this.db.onsuccess = (event) => {
                    let db = event.target.result;
                    let transaction = db.transaction(['collection-item'], 'readonly');
                    let objectStore = transaction.objectStore('collection-item');
                    let index = objectStore.index('name');
                    let request = index.openCursor(IDBKeyRange.only('Neue Collection'));

                    request.onsuccess = (event) => {
                        let cursor = event.target.result;
                        if (cursor) {
                            buildElement(cursor.value)
                            cursor.continue();
                        }
                    };
                };

                async function buildElement(element) {

                    const timestamp = element.metadata.editTimestamp;

                    const date = new Date(timestamp);

                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    };

                    const formattedDate = date.toLocaleDateString(undefined, options);

                    const content = `
                        <div class="gallery-title">
                            <h2>${element.metadata.name}</h2>
                            <i class="edit-btn-name bi bi-pencil-square"></i>
                        </div>
                        <div class="gallery-date">
                            <i>last edited ${formattedDate}</i>
                        </div>
                        <div class="gallery-icon">
                            <img class="icon"
                                src="${element.metadata.icon}">
                        </div>
                        <div class="gallery-desc">
                            <p>${element.metadata.description}</p>
                        </div>
                    `;

                    const contentContainer = document.createElement('div');

                    contentContainer.classList.add('gallery-meta');
                    contentContainer.id = `metadata-${element.uuid}`
                    contentContainer.innerHTML = content;

                    const collectionContainer = document.querySelector('#content-area');

                    collectionContainer.insertBefore(contentContainer, document.querySelector('.gallery-content'));

                    //------__-----__----__------

                    const collectionInterface = `<div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-alpha-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-numeric-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-funnel"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-file-earmark-plus"></i></button></div>`;

                    const collectionInterfaceContainer = document.createElement('div');
                    collectionInterfaceContainer.classList.add('collection-interface');
                    collectionInterfaceContainer.innerHTML = collectionInterface;

                    collectionContainer.insertBefore(collectionInterfaceContainer, document.querySelector('.gallery-content'));
                };

                break;

            case 'set':

                this.db.onupgradeneeded = (event) => {
                    let db = event.target.result;
                    let objectStore = db.createObjectStore('collection-item', { keyPath: 'uuid' });
                    objectStore.createIndex('name', 'metadata.name', { unique: false });
                    objectStore.createIndex('timestamp', 'metadata.editTimestamp', { unique: false });
                };

                this.db.onsuccess = (event) => {
                    let db = event.target.result;
                    let transaction = db.transaction(['collection-item'], 'readwrite');
                    let objectStore = transaction.objectStore('collection-item');

                    let request = objectStore.add(element);

                    request.onsuccess = () => {
                        console.info('successfully added element to db');
                    };

                    request.onerror = () => {
                        console.error('error while creating db entry!');
                    };
                };

                break;
        }

        return;
    }

    async newAlbum(element, action) {
        switch (action) {
            case 'load':
                this.db.onsuccess = (event) => {
                    let db = event.target.result;
                    let transaction = db.transaction(['album-item'], 'readonly');
                    let objectStore = transaction.objectStore('album-item');
                    let index = objectStore.index('name');
                    let request = index.openCursor(IDBKeyRange.only('Neues Album'));

                    request.onsuccess = (event) => {
                        let cursor = event.target.result;
                        if (cursor) {
                            buildElement(cursor.value)
                            cursor.continue();
                        }
                    };
                };

                async function buildElement(element) {

                    const timestamp = element.metadata.editTimestamp;

                    const date = new Date(timestamp);

                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    };

                    const formattedDate = date.toLocaleDateString(undefined, options);

                    const content = `
                        <div class="gallery-title">
                            <h2>${element.metadata.name}</h2>
                            <i class="edit-btn-name bi bi-pencil-square"></i>
                        </div>
                        <div class="gallery-date">
                            <i>last edited ${formattedDate}</i>
                        </div>
                        <div class="gallery-icon">
                            <img class="icon"
                                src="${element.metadata.icon}">
                        </div>
                        <div class="gallery-desc">
                            <p>${element.metadata.description}</p>
                        </div>
                    `;

                    const contentContainer = document.createElement('div');

                    contentContainer.classList.add('gallery-meta');
                    contentContainer.id = `metadata-${element.uuid}`
                    contentContainer.innerHTML = content;

                    const collectionContainer = document.querySelector('#content-area');

                    collectionContainer.insertBefore(contentContainer, document.querySelector('.gallery-content'));

                    //------__-----__----__------

                    const collectionInterface = `<div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-alpha-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-numeric-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-sort-down"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-funnel"></i></button></div><div class="collection-interface-item"><button class="ui-element collection-btn"><i class="bi bi-file-earmark-plus"></i></button></div>`;

                    const collectionInterfaceContainer = document.createElement('div');
                    collectionInterfaceContainer.classList.add('collection-interface');
                    collectionInterfaceContainer.innerHTML = collectionInterface;

                    collectionContainer.insertBefore(collectionInterfaceContainer, document.querySelector('.gallery-content'));
                };

                break;

            case 'set':

                this.db.onupgradeneeded = (event) => {
                    let db = event.target.result;
                    let objectStore = db.createObjectStore('album-item', { keyPath: 'uuid' });
                    objectStore.createIndex('name', 'metadata.name', { unique: false });
                    objectStore.createIndex('timestamp', 'metadata.editTimestamp', { unique: false });
                };

                this.db.onsuccess = (event) => {
                    let db = event.target.result;
                    let transaction = db.transaction(['album-item'], 'readwrite');
                    let objectStore = transaction.objectStore('album-item');

                    let request = objectStore.add(element);

                    request.onsuccess = () => {
                        console.info('successfully added element to db');
                    };

                    request.onerror = () => {
                        console.error('error while creating db entry!');
                    };
                };

                break;
        }

        return;
    }
}

export const build = new BUILD();