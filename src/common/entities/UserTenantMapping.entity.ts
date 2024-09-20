import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('UserTenantMapping')
export class UserTenantMapping {
    @PrimaryGeneratedColumn('uuid', { name: 'Id' })
    Id: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @Column('uuid', { name: 'tenantId'})
    tenantId?: string;

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy?: string;

    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy?: string;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updatedAt' })
    updatedAt: Date;

    constructor(obj: Partial<UserTenantMapping>) {
        Object.assign(this, obj);
    }
}
