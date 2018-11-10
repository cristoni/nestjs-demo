import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

/**
 * ConfigService is used the load, validate and inject our projects configuration
 * inside other modules
 */
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {

    // Load the config file
    const config = dotenv.parse(fs.readFileSync(filePath));

    // Validate the config file and save it in this service instance
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      DB_HOST: Joi.string().hostname().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().allow('').required(),
      DB_NAME: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  public getDbHost(): string {
    return this.envConfig.DB_HOST;
  }

  public getDbPort(): number {
    return Number(this.envConfig.DB_PORT);
  }

  public getDbUsername(): string {
    return this.envConfig.DB_USERNAME;
  }

  public getDbPassword(): string {
    return this.envConfig.DB_PASSWORD;
  }

  public getDbName(): string {
    return this.envConfig.DB_NAME;
  }
}