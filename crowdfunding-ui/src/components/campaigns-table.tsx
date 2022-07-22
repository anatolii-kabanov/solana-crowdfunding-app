import React, { useEffect, useState } from 'react';
import { BN, Program, ProgramAccount, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Button, Table } from 'react-bootstrap';

interface CampaignsTableProps {
    program: Program;
    walletKey: PublicKey;
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
    program,
    walletKey,
}) => {
    const [campaigns, setCampaigns] = useState<ProgramAccount[]>([]);

    const getAllCampaigns = async () => {
        const campaigns = await program.account.campaign.all();
        setCampaigns(campaigns);
    };

    useEffect(() => {
        getAllCampaigns();
    }, [walletKey]);

    const donate = async (campaignKey: PublicKey) => {
        try {
            await program.methods
                .donate(new BN(0.2 * web3.LAMPORTS_PER_SOL))
                .accounts({
                    campaign: campaignKey,
                    user: walletKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();
            await getAllCampaigns();
        } catch (err) {
            console.error('Donate transaction error: ', err);
        }
    };

    const withdraw = async (campaignKey: PublicKey) => {
        try {
            await program.methods
                .withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL))
                .accounts({
                    campaign: campaignKey,
                    user: walletKey,
                })
                .rpc();
        } catch (err) {
            console.error('Withdraw transaction error: ', err);
        }
    };

    const allCampaigns: () => JSX.Element[] = () => {
        return campaigns.map((c, i) => {
            const key = c.publicKey.toBase58();

            return (
                <tr key={key}>
                    <td>{i + 1}</td>
                    <td>{c.account.name}</td>
                    <td>{c.account.description}</td>
                    <td>{c.account.targetAmount.toString()}</td>
                    <td>{(c.account.amountDonated / web3.LAMPORTS_PER_SOL).toString()}</td>
                    <td>
                        <Button
                            className='m-1'
                            variant='primary'
                            onClick={() => donate(c.publicKey)}
                        >
                            Donate
                        </Button>
                        <Button
                            disabled={c.account.owner.toBase58() !== walletKey.toBase58()}
                            className='m-1'
                            variant='danger'
                            onClick={() => withdraw(c.publicKey)}
                        >
                            Withdraw
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <>
            <div>Campaigns</div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Target Amount</th>
                        <th>Donated</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{allCampaigns()}</tbody>
            </Table>
        </>
    );
};

export default CampaignsTable;
