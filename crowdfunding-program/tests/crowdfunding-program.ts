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

    const [compaingAccount] = utils.publicKey.findProgramAddressSync(
        [
            utils.bytes.utf8.encode("compaing_demo"),
            anchorProvider.wallet.publicKey.toBuffer(),
        ],
        program.programId
    );
    
    it('Should create compaing', async () => {
        /* Call the create function via RPC */
        
        await program.methods
            .create('test compaing', 'test description', new anchor.BN(5))
            .accounts({
                compaing: compaingAccount,
                user: anchorProvider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const compaingAcc = await program.account.compaing.fetch(
            compaingAccount,
        );
        assert.equal(compaingAcc.name, 'test compaing');
        assert.equal(compaingAcc.description, 'test description');
        assert.ok(compaingAcc.targetAmount.eq(new anchor.BN(5)));
        assert.ok(compaingAcc.owner.equals(anchorProvider.wallet.publicKey));
        assert.ok(compaingAcc.amountDonated.eq(new anchor.BN(0)));
    });
});

