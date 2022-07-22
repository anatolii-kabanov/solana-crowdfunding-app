import React, { ChangeEvent, useState } from 'react';
import {
    AnchorProvider,
    BN,
    Idl,
    Program,
    utils,
    web3,
} from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Commitment, Connection, PublicKey } from '@solana/web3.js';
import idl from '../idl.json';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import CampaignsTable from '../components/campaigns-table';

const opts: { preflightCommitment: Commitment } = {
    preflightCommitment: 'processed',
};

const programId = new PublicKey(idl.metadata.address);

interface CampaignsViewProps {
    network: string;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ network }) => {
    const wallet = useWallet();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState<number>(1);

    const getProgram = () => {
        /* create the provider and return it to the caller */ 
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(connection, wallet as any, opts);
        /* create the program interface combining the idl, program ID, and provider */
        const program = new Program(idl as Idl, programId, provider);
        return program;
    };

    const program = getProgram();

    const onNameChange = (e: ChangeEvent<any>) => {
        setName(e.target.value);
    };
    const onDescriptionChange = (e: ChangeEvent<any>) => {
        setDescription(e.target.value);
    };
    const onTargetAmountChange = (e: ChangeEvent<any>) => {
        setTargetAmount(e.target.value);
    };

    const createCampaign = async () => {
        const [campaign] = await PublicKey.findProgramAddress(
            [
                utils.bytes.utf8.encode('campaign_demo'),
                wallet.publicKey!.toBuffer(),
            ],
            program.programId,
        );
        await program.methods
            .create(name, description, new BN(targetAmount))
            .accounts({
                campaign: campaign,
                user: wallet.publicKey!,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();
    };

    return (
        <div className='campaigns-view p-5'>
            {!wallet.connected && <WalletMultiButton />}
            <Form>
                <Form.Group className='mb-3'>
                    <FloatingLabel controlId='name' label='Name'>
                        <Form.Control
                            type='text'
                            placeholder='Name of the campaign'
                            value={name}
                            onChange={onNameChange}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel controlId='description' label='Description'>
                        <Form.Control
                            as='textarea'
                            placeholder='Description of the campaign'
                            style={{ height: '150px' }}
                            value={description}
                            onChange={onDescriptionChange}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                        controlId='targetAmount'
                        label='Target Amount'
                        className='mb-3'
                    >
                        <Form.Control
                            as='input'
                            type='number'
                            placeholder='Targemt amount that need to be reached'
                            value={targetAmount}
                            onChange={onTargetAmountChange}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Button variant='primary' onClick={createCampaign}>
                        Create Campaign
                    </Button>
                </Form.Group>
            </Form>
            {wallet.connected && <CampaignsTable  walletKey={wallet.publicKey!} program={program}/>}
        </div>
    );
};

export default CampaignsView;
