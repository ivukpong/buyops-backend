import { IsString, IsEmail, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum CompanyTypeEnum {
  LIMITED = 'LIMITED',
  ENTERPRISE = 'ENTERPRISE',
  PARTNERSHIP = 'PARTNERSHIP',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  NGO = 'NGO',
}

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEnum(CompanyTypeEnum, { message: 'type must be a valid company type' })
  type: CompanyTypeEnum;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  contactPerson: string;

  @IsString()
  address: string;

  @IsNumber()
  commissionRate: number;

  @IsString()
  paymentTerms: string;

  @IsString()
  bankName: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  bankAccountName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}