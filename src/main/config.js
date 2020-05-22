const fs = require('fs');


export class Config {
    constructor(wowdir) {
        this._path_cfg = `${wowdir}/wowlite.json`;
        this.create();
        this.data = this.load();
    }

    load(){
        if (!fs.existsSync(this._path_cfg)) {
            console.log('no file yo');
            return {};
        }

        let contents = fs.readFileSync(this._path_cfg, 'utf8');
        return JSON.parse(contents);
    }

    create(){
        if (fs.existsSync(this._path_cfg)) {
            return;
        }

        let data = JSON.stringify({
            "node": "wow.candy.surf:34568",
            "nodes": [
                {"address": "wow.candy.surf:34568", "location": "All you can eat.", "region": "WOW"},
                {"address": "so.wow.candy.surf:34568", "location": "San Francisco, United States", "region": "US"},
                {"address": "much.wow.candy.surf:34568", "location": "London, England", "region": "UK"},
                {"address": "such.wow.candy.surf:34568", "location": "Montreal, Canada", "region": "CA"},
                {"address": "very.wow.candy.surf:34568", "location": "Bangalore, India", "region": "IN"},
                {"address": "localhost:34568", 'location': "", "region": "*"}
            ],
            "wallets": []
        });

        fs.writeFileSync(this._path_cfg, JSON.stringify(data));
        console.log(`${this._path_cfg} written`);
    }

    save(){
        fs.writeFileSync(this._path_cfg, JSON.stringify(this.data, null, 4));
        console.log(`${this._path_cfg} written`);
    }

    selectNode(node){
        if (typeof this.data === 'string' || this.data instanceof String){
            this.data = JSON.parse(this.data);
        }

        node = node.trim();
        if(node === ''){
            return;
        }

        console.log('NEW NODE: ' + node);
        this.data.node = node;
        this.save();

        return true;
    }
}
