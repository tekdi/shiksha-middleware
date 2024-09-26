import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, 
} from 'typeorm';

@Entity('UserRolesMapping')
export class UserRolesMapping {
    @PrimaryGeneratedColumn('uuid', { name: 'userRolesId' })
    userRolesId: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @Column('uuid', { name: 'roleId' })
    roleId: string;

    @Column('uuid', { name: 'tenantId', nullable: true })
    tenantId?: string;

    @Column('uuid', { name: 'createdBy', nullable: true })
    createdBy?: string;

    @Column('uuid', { name: 'updatedBy', nullable: true })
    updatedBy?: string;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updatedAt' })
    updatedAt: Date;

    constructor(obj: Partial<UserRolesMapping>) {
        Object.assign(this, obj);
    }

}
