import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('CohortMembers')
export class CohortMembers {
    @PrimaryGeneratedColumn('uuid', { name: 'cohortMembershipId' })
    cohortMembershipId: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @Column('uuid', { name: 'cohortId'})
    cohortId: string;

    @Column({name:'status'})
    status : string

    @Column({name:'statusReason'})
    statusReason: string

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy?: string;

    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy?: string;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updatedAt' })
    updatedAt: Date;


    constructor(obj: Partial<CohortMembers>) {
        Object.assign(this, obj);
    }
}
