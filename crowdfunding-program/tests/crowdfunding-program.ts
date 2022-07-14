import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { CrowdfundingProgram } from '../target/types/crowdfunding_program';
import assert from 'assert';

describe('crowdfunding-program', async () => {
    /* create and set a Provider */
    const anchorProvider = anchor.AnchorProvider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(anchorProvider);

    const program = anchor.workspace
        .CrowdfundingProgram as Program<CrowdfundingProgram>;

    const compaingAccount = anchor.web3.Keypair.generate();
    const user1 = anchor.web3.Keypair.generate();

    it('Should create compaing', async () => {
        /* Call the create function via RPC */
        
        await program.methods
            .create('test compaing', 'test description', new anchor.BN(5))
            .accounts({
                compaing: compaingAccount.publicKey,
                user: user1.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([user1])
            .rpc();

        const compaingAcc = await program.account.compaing.fetch(
            compaingAccount.publicKey,
        );
        assert.equal(compaingAcc.name, 'test compaing');
        assert.equal(compaingAcc.description, 'test description');
        assert.ok(compaingAcc.targetAmount.eq(new anchor.BN(5)));
        assert.equal(compaingAcc.owner, user1.publicKey);
        assert.equal(compaingAcc.amountDonated, new anchor.BN(0));
    });
});

