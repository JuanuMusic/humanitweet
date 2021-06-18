export default {
    async balanceOf(address: string, drizzle: any) {
        const ubiContract = drizzle.contracts["DummyUBI"];
          return await ubiContract.methods
            .balanceOf(address)
            .call();
    }
}