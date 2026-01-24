import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import Company from "./Company";
import Whatsapp from "./Whatsapp";

@Table
class WhatsappTemplate extends Model<WhatsappTemplate> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    category: string; // MARKETING | UTILITY | AUTHENTICATION

    @AllowNull(false)
    @Default("es")
    @Column(DataType.STRING)
    language: string;

    @AllowNull(false)
    @Default("PENDING")
    @Column(DataType.STRING)
    status: string; // PENDING | APPROVED | REJECTED | PAUSED

    @AllowNull(true)
    @Default("NONE")
    @Column(DataType.STRING)
    headerType: string; // TEXT | IMAGE | VIDEO | DOCUMENT | NONE

    @AllowNull(true)
    @Column(DataType.TEXT)
    headerContent: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    bodyText: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    footerText: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    buttons: string; // JSON string of buttons array

    @AllowNull(true)
    @Column(DataType.STRING)
    metaTemplateId: string; // ID returned by Meta

    @ForeignKey(() => Company)
    @Column
    companyId: number;

    @BelongsTo(() => Company)
    company: Company;

    @ForeignKey(() => Whatsapp)
    @Column
    whatsappId: number;

    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}

export default WhatsappTemplate;
