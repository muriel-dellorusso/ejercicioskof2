const ID = "id";

export class PGEvent {
    constructor() {
        this.data = {
            type: "blockly-type",
            id: "",
        };
    }
    
    getValues() {
        const url = document.location.href;
        const paths = url.split("?");
        if (paths.length < 2) {
            return;
        }
        const queryStrings = paths[1].split("&");
        for (const qs of queryStrings) {
            if (qs.length < 2) {
            continue;
            }
            const values = qs.split("=");
            if (values.length < 2) {
            continue;
            }
            switch (values[0]) {
            case ID:
                this.data[ID] = values[1];
                break;
            }
        }
    }
    

    postToPg(dataObject) {
        dataObject.type = this.data.type
        dataObject.id = this.data.id 
        console.log("postToPg", dataObject);    
        window.top.postMessage(dataObject, "*");
    }
    
}