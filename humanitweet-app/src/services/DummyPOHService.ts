 export default {
    async registerHuman(address: string, drizzle: any) {
        const dummyPoh = drizzle.contracts["DummyProofOfHumanity"];
        await dummyPoh.methods
            .register(address)
            .send({ from: address });
    }
 }