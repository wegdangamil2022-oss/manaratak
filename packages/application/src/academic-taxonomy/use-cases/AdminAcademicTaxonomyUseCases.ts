import {
  IAcademicTaxonomyRepository,
  IAcademicTaxonomyValidationService,
  AcademicTaxonomyValidationService,
  AcademicTaxonomyCompletenessReport,
  AcademicTaxonomyNodeDto,
  UpsertAcademicTaxonomyNodeDto,
  AcademicTaxonomyEdgeDto,
  UpsertAcademicTaxonomyEdgeDto,
  AcademicTaxonomyAliasDto,
  UpsertAcademicTaxonomyAliasDto,
  AcademicStandardMappingDto,
  UpsertAcademicStandardMappingDto,
  AcademicTaxonomyValidationSeverity,
  AcademicTaxonomyValidationIssue,
  AcademicTaxonomySeedBatch,
} from '@manaratak/domain';
import {
  AcademicTaxonomyImportHandoffService,
  AcademicTaxonomyImportHandoffCommand,
} from '../services';

export class AdminAcademicTaxonomyUseCases {
  constructor(
    private readonly repository: IAcademicTaxonomyRepository,
    private readonly validationService: IAcademicTaxonomyValidationService = new AcademicTaxonomyValidationService(),
    private readonly importHandoffService: AcademicTaxonomyImportHandoffService = new AcademicTaxonomyImportHandoffService()
  ) {}

  public validateNode(
    data: UpsertAcademicTaxonomyNodeDto
  ): AcademicTaxonomyCompletenessReport {
    return this.validationService.validateNode(data);
  }

  public async upsertNode(data: UpsertAcademicTaxonomyNodeDto): Promise<{
    node: AcademicTaxonomyNodeDto;
    report: AcademicTaxonomyCompletenessReport;
  }> {
    const report = this.validateNode(data);
    this.assertNoErrors(report.issues, 'Node validation failed');

    const node = await this.repository.upsertNode(data);
    return { node, report };
  }

  public async addEdge(data: UpsertAcademicTaxonomyEdgeDto): Promise<AcademicTaxonomyEdgeDto> {
    const existingNodes = await this.repository.listNodes();
    const existingEdges = this.buildExistingEdgesContext();

    const issues = this.validationService.validateEdge({
      edge: data,
      existingNodes,
      existingEdges,
    });
    this.assertNoErrors(issues, 'Edge validation failed');

    return this.repository.addEdge(data);
  }

  public async removeEdge(edgeId: string): Promise<void> {
    return this.repository.removeEdge(edgeId);
  }

  public async addAlias(data: UpsertAcademicTaxonomyAliasDto): Promise<AcademicTaxonomyAliasDto> {
    const existingAliases = await this.repository.listAliases(data.nodeId);

    const issues = this.validationService.validateAlias({
      alias: data,
      existingAliases,
    });
    this.assertNoErrors(issues, 'Alias validation failed');

    return this.repository.addAlias(data);
  }

  public async addMapping(
    data: UpsertAcademicStandardMappingDto
  ): Promise<AcademicStandardMappingDto> {
    const existingMappings = await this.repository.listMappings(data.sourceNodeId);

    const issues = this.validationService.validateMapping({
      mapping: data,
      existingMappings,
    });
    this.assertNoErrors(issues, 'Mapping validation failed');

    return this.repository.addMapping(data);
  }

  public prepareImportHandoff(
    command: AcademicTaxonomyImportHandoffCommand
  ): AcademicTaxonomySeedBatch {
    return this.importHandoffService.prepareSeedBatch(command);
  }

  protected buildExistingEdgesContext(): Array<{
    parentNodeId: string;
    childNodeId: string;
    isPrimary?: boolean;
  }> {
    return [];
  }

  private assertNoErrors(issues: AcademicTaxonomyValidationIssue[], messagePrefix: string): void {
    const errorIssues = issues.filter(
      (issue) => issue.severity === AcademicTaxonomyValidationSeverity.ERROR
    );

    if (errorIssues.length > 0) {
      const errorCodes = errorIssues.map((i) => i.code).join(', ');
      throw new Error(`${messagePrefix}: ${errorCodes}`);
    }
  }
}
