import consts from "consts/const_global";
import NodesList from "node/lists/Nodes-List";
import Serialization from "common/utils/Serialization";
import PoolMining from "common/mining-pools/miner/mining/Pool-Mining";
import MinerPoolProtocol from "common/mining-pools/miner/protocol/Miner-Pool-Protocol"
import MinerPoolSettings from "common/mining-pools/miner/Miner-Pool-Settings"

class MinerProtocol {

    constructor (){

        //this stores the last sent hash

        this.minerPoolSettings = new MinerPoolSettings(this);
        this.minerPoolProtocol = new MinerPoolProtocol(this);

        this._miningData = {
            blockData: undefined,
            difficultyTarget: undefined
        };
        
        this._poolMining = new PoolMining();

    }

    async initializeMinerPoolManagement(poolURL){

        await this.minerPoolSettings.initializeMinerPoolSettings(poolURL);

    }

    async startMinerPool(poolURL){

        if (poolURL !== undefined)
            this.minerPoolSettings.setPoolURL(poolURL);

        if (this.minerPoolSettings.poolURL !== undefined && this.minerPoolSettings.poolURL !== '')
            return await this.minerPoolProtocol.startMinerProtocol(this.minerPoolSettings.poolURL);
        else {
            console.error("Couldn't start MinerPool");
            return false;
        }

    }

    getMiningData() {

        //TODO: get data from PoolLeader and deserialize
        //mining data should be like {blockData: , difficultyTarget: }
        //blockData should be like this:  {height: , difficultyTargetPrev: , computedBlockPrefix: , nonce: }
        return this._miningData;

    }

    async _mine(blockData, difficultyTarget) {
        
        this._poolMining.mine(blockData, difficultyTarget);
    }

    async createMiningHashes(){

        //TODO: create a list with best X hashes
        let answer;
        try {

            answer = await this._mine(this._miningData.blockData, this._miningData.difficultyTarget);

        } catch (exception){
            console.error("Couldn't mine block ", this._miningData.blockData, exception);
            answer.result = false;
        }

        return answer;

    }
    
    async run() {
        
        await this._mine(this._miningData.blockData, this._miningData.difficultyTarget);
        
    }

}

export default MinerProtocol;