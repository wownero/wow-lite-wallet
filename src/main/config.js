const fs = require('fs');


export class Config {
    constructor(wowdir) {
        this._path_cfg = `${wowdir}/wowlight.json`;
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
            "node": "node.wowne.ro:34568",
            "nodes": [
                {"address": "node.wowne.ro:34568", "location": "New Jersey, United States", "region": "US"},
                {"address": "node.pwned.systems:34568", "location": "Amsterdam, The Netherlands", "region": "EU"},
                {"address": "node.wownero.com:34568", "location": "Montreal, Canada", "region": "US"},
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

    saveLastWalletPath(path){
        console.log(this.data);
        if (typeof this.data === 'string' || this.data instanceof String){
            this.data = JSON.parse(this.data);
        }

        if(path === ''){
            return;
        }

        if(!this.data.hasOwnProperty('wallets')){
            this.data.wallets = [];
        }
        
        const name = path.split('/').pop();
        this.data.wallets.push({ name, path });
        this.save();
    }
}
