import dotenv from "dotenv"
dotenv.config()
import { Session, Chains, Serializer, Bytes, UInt64 } from "@wharfkit/session"
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey"

const accountName = process.env.ACCOUNT
const privateKey = process.env.PRIVATE_KEY
const walletPlugin = new WalletPluginPrivateKey(privateKey)

const session = new Session({
    actor: accountName,
    permission: 'active',
    chain: Chains.Jungle4,
    walletPlugin,
})


const main = async () => {
    const result = await session.transact({ action: {
            account: "k3daa5wt1vre",
            name: "testaction",
            authorization: [session.permissionLevel],
            data: {},
        } });

    // find the first key with a value in 'return_value_hex_data' by recursing the object
    let hexData = null;
    const findHexData = (obj) => {
        if(hexData) return;
        if(!obj) return;
        Object.keys(obj).forEach((key) => {
            if (key === 'return_value_hex_data') {
                hexData = obj[key];
            } else if (typeof obj[key] === 'object') {
                findHexData(obj[key]);
            }
        });
    }

    findHexData(result.response);
    if(!hexData) {
        return console.log("No data found");
    }

    const deserialized = Serializer.decode({data: Bytes.from(hexData), type: UInt64});
    console.log(deserialized);
    console.log(deserialized.toString());

}

main();
