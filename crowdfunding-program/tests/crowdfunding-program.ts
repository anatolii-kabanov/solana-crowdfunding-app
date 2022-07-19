import * as anchor from '@project-serum/anchor';
import { Program, utils } from '@project-serum/anchor';
import { CrowdfundingProgram } from '../target/types/crowdfunding_program';
import assert from 'assert';

describe('crowdfunding-program', async () => {
    /* create and set a Provider */
    const anchorProvider = anchor.AnchorProvider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(anchorProvider);

    const program = anchor.workspace
        .CrowdfundingProgram as Program<CrowdfundingProgram>;

    const [campaignAccount] = utils.publicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("campaign_demo"),
            anchorProvider.wallet.publicKey.toBuffer(),
        ],
        program.programId
    );

    it('Should create campaign', async () => {
        /* Call the create function via RPC */
        
        await program.methods
            .create('test campaign', 'test description', new anchor.BN(5))
            .accounts({
                campaign: campaignAccount,
                user: anchorProvider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const campaignAcc = await program.account.compaing.fetch(
            campaignAccount,
        );
        assert.equal(campaignAcc.name, 'test campaign');
        assert.equal(campaignAcc.description, 'test description');
        assert.ok(campaignAcc.targetAmount.eq(new anchor.BN(5)));
        assert.ok(campaignAcc.owner.equals(anchorProvider.wallet.publicKey));
        assert.ok(campaignAcc.amountDonated.eq(new anchor.BN(0)));
    });
});

