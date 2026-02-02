import { 
  IsString, 
  IsEmail, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsNotEmpty,
  Min,
  Max,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  IsIn
} from 'class-validator';
import { Transform } from 'class-transformer';

// ══════════════════════════════════════════════════════════════════════════
// COMPANY DTOs - BUG_013, BUG_014, BUG_017 FIXES
// Complete validation for all company fields
// ══════════════════════════════════════════════════════════════════════════

// BUG_013 FIX: Proper company type enum matching design
export enum CompanyTypeEnum {
  DEVELOPER = 'developer',
  REALTOR = 'realtor',
  PARTNER = 'partner',
  CONSULTANT = 'consultant',
  INVESTOR = 'investor',
}

export enum CompanyStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreateCompanyDto {
  // ═══ BASIC INFORMATION ═══
  
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MinLength(2, { message: 'Company name must be at least 2 characters' })
  @MaxLength(200, { message: 'Company name must not exceed 200 characters' })
  name: string;

  // BUG_013 FIX: Use proper enum validation
  @IsEnum(CompanyTypeEnum, { 
    message: 'Company type must be one of: developer, realtor, partner, consultant, investor' 
  })
  @IsNotEmpty({ message: 'Company type is required' })
  type: CompanyTypeEnum;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Registration number must not exceed 50 characters' })
  registrationNumber?: string;

  @IsOptional()
  @IsEnum(CompanyStatusEnum, {
    message: 'Status must be one of: active, inactive, suspended'
  })
  status?: CompanyStatusEnum;

  // ═══ CONTACT INFORMATION ═══
  
  @IsString()
  @IsNotEmpty({ message: 'Contact person name is required' })
  @MinLength(2, { message: 'Contact person name must be at least 2 characters' })
  @MaxLength(100, { message: 'Contact person name must not exceed 100 characters' })
  contactPerson: string;

  // BUG_014 FIX: Proper email validation with transform
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[+]?[\d\s()-]+$/, { 
    message: 'Please provide a valid phone number (digits, spaces, +, -, () allowed)' 
  })
  @MinLength(10, { message: 'Phone number must be at least 10 characters' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Address must not exceed 500 characters' })
  address?: string;

  // ═══ AGREEMENT DETAILS ═══
  
  @IsDateString({}, { message: 'Agreement start date must be a valid date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Agreement start date is required' })
  agreementStartDate: string;

  @IsDateString({}, { message: 'Agreement expiry date must be a valid date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Agreement expiry date is required' })
  agreementExpiryDate: string;

  // ═══ FINANCIAL INFORMATION ═══
  
  @IsNumber({}, { message: 'Commission rate must be a number' })
  @Min(0, { message: 'Commission rate cannot be negative' })
  @Max(100, { message: 'Commission rate cannot exceed 100' })
  @IsNotEmpty({ message: 'Commission rate is required' })
  commissionRate: number;

  // BUG_017 FIX: Payment terms field
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Payment terms must not exceed 500 characters' })
  paymentTerms?: string;

  // ═══ BANK DETAILS (BUG_017 FIX) ═══
  
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Account name must not exceed 100 characters' })
  accountName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Bank name must not exceed 100 characters' })
  bankName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\d]+$/, { message: 'Account number must contain only digits' })
  @MinLength(10, { message: 'Account number must be at least 10 digits' })
  @MaxLength(20, { message: 'Account number must not exceed 20 digits' })
  accountNumber?: string;

  // ═══ ADDITIONAL INFORMATION ═══
  
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

// ══════════════════════════════════════════════════════════════════════════
// UPDATE DTO - All fields optional
// ══════════════════════════════════════════════════════════════════════════

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsEnum(CompanyTypeEnum, { 
    message: 'Company type must be one of: developer, realtor, partner, consultant, investor' 
  })
  type?: CompanyTypeEnum;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  registrationNumber?: string;

  @IsOptional()
  @IsEnum(CompanyStatusEnum, {
    message: 'Status must be one of: active, inactive, suspended'
  })
  status?: CompanyStatusEnum;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  contactPerson?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s()-]+$/, { message: 'Please provide a valid phone number' })
  @MinLength(10)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsDateString()
  agreementStartDate?: string;

  @IsOptional()
  @IsDateString()
  agreementExpiryDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\d]+$/)
  @MinLength(10)
  @MaxLength(20)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

// ══════════════════════════════════════════════════════════════════════════
// QUERY/FILTER DTOs
// ══════════════════════════════════════════════════════════════════════════

export class FilterCompaniesDto {
  @IsOptional()
  @IsEnum(CompanyTypeEnum)
  type?: CompanyTypeEnum;

  @IsOptional()
  @IsEnum(CompanyStatusEnum)
  status?: CompanyStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}