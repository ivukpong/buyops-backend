import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

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

  // Add other required fields as per Figma
}