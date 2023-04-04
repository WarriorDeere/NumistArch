class BUILD {

    constructor(){
        this.elementUUID = crypto.randomUUID();
    }

    async newCollection(element) {

        const finalElementNoDOM = JSON.stringify(element);

        localStorage.setItem(`collection-${this.elementUUID}`, finalElementNoDOM);
    }
    
    async newAlbum(element) {
        const finalElementNoDOM = JSON.stringify(element);
    
        localStorage.setItem(`album-${this.elementUUID}`, finalElementNoDOM);
    }
}

export const build = new BUILD();