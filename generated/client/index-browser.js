
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  taxId: 'taxId',
  currency: 'currency',
  logoUrl: 'logoUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contactPerson: 'contactPerson',
  contractType: 'contractType',
  paymentTerms: 'paymentTerms',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  name: 'name',
  location: 'location',
  duration: 'duration',
  budget: 'budget',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  totalFloorArea: 'totalFloorArea',
  carportArea: 'carportArea'
};

exports.Prisma.ProjectMemberScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  userId: 'userId',
  role: 'role',
  assignedAt: 'assignedAt'
};

exports.Prisma.BoqItemScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  itemDescription: 'itemDescription',
  unit: 'unit',
  materialUnitPrice: 'materialUnitPrice',
  laborUnitPrice: 'laborUnitPrice',
  quantity: 'quantity',
  isCarport: 'isCarport'
};

exports.Prisma.BoqItemComponentScalarFieldEnum = {
  id: 'id',
  boqItemId: 'boqItemId',
  resourceType: 'resourceType',
  name: 'name',
  quantityFactor: 'quantityFactor',
  unitRate: 'unitRate',
  totalComponentCost: 'totalComponentCost',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaterialRequestScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  requesterId: 'requesterId',
  approverId: 'approverId',
  requestDate: 'requestDate',
  status: 'status',
  remarks: 'remarks',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaterialRequestItemScalarFieldEnum = {
  id: 'id',
  materialRequestId: 'materialRequestId',
  itemDescription: 'itemDescription',
  description: 'description',
  quantity: 'quantity',
  materialUnitPrice: 'materialUnitPrice',
  laborUnitPrice: 'laborUnitPrice',
  unit: 'unit'
};

exports.Prisma.RFQScalarFieldEnum = {
  id: 'id',
  mrId: 'mrId',
  createdById: 'createdById',
  title: 'title',
  status: 'status',
  dueDate: 'dueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RFQItemScalarFieldEnum = {
  id: 'id',
  rfqId: 'rfqId',
  materialName: 'materialName',
  quantity: 'quantity',
  unit: 'unit'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contactPerson: 'contactPerson',
  email: 'email',
  phone: 'phone',
  address: 'address',
  rating: 'rating'
};

exports.Prisma.MaterialScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  unit: 'unit',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UnitScalarFieldEnum = {
  id: 'id',
  name: 'name',
  abbreviation: 'abbreviation',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarehouseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  type: 'type'
};

exports.Prisma.SupplierQuotationScalarFieldEnum = {
  id: 'id',
  rfqId: 'rfqId',
  supplierId: 'supplierId',
  quoteDate: 'quoteDate',
  totalAmount: 'totalAmount',
  currency: 'currency',
  isSelected: 'isSelected'
};

exports.Prisma.QuotationItemScalarFieldEnum = {
  id: 'id',
  supplierQuotationId: 'supplierQuotationId',
  materialName: 'materialName',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  remarks: 'remarks'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  orderDate: 'orderDate',
  projectId: 'projectId',
  supplierId: 'supplierId',
  requesterId: 'requesterId',
  approverId: 'approverId',
  status: 'status',
  remarks: 'remarks',
  totalAmount: 'totalAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderItemScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  materialName: 'materialName',
  description: 'description',
  quantity: 'quantity',
  unit: 'unit',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice'
};

exports.Prisma.ReceivingReportScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  receivedById: 'receivedById',
  receivedDate: 'receivedDate',
  deliveryNoteNo: 'deliveryNoteNo',
  notes: 'notes'
};

exports.Prisma.ReceivingItemScalarFieldEnum = {
  id: 'id',
  receivingReportId: 'receivingReportId',
  materialName: 'materialName',
  quantityReceived: 'quantityReceived',
  status: 'status'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  materialName: 'materialName',
  projectId: 'projectId',
  warehouseId: 'warehouseId',
  quantity: 'quantity',
  unit: 'unit',
  lastUpdated: 'lastUpdated'
};

exports.Prisma.WorkflowRuleScalarFieldEnum = {
  id: 'id',
  processType: 'processType',
  minAmount: 'minAmount',
  maxAmount: 'maxAmount',
  approverRole: 'approverRole',
  stepOrder: 'stepOrder',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierInvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  invoiceDate: 'invoiceDate',
  supplierId: 'supplierId',
  purchaseOrderId: 'purchaseOrderId',
  receivingReportId: 'receivingReportId',
  totalAmount: 'totalAmount',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.DisbursementScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  processedById: 'processedById',
  amount: 'amount',
  paymentDate: 'paymentDate',
  method: 'method',
  referenceNumber: 'referenceNumber',
  status: 'status'
};

exports.Prisma.FinancialTransactionScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  date: 'date',
  type: 'type',
  category: 'category',
  description: 'description',
  amount: 'amount',
  reference: 'reference',
  metadata: 'metadata'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  ENGINEER: 'ENGINEER',
  FINANCE: 'FINANCE',
  AUDITOR: 'AUDITOR',
  HEAD_OF_ADMIN: 'HEAD_OF_ADMIN',
  ENCODER: 'ENCODER',
  PURCHASER: 'PURCHASER',
  APPROVER: 'APPROVER',
  CASH_DISBURSEMENT: 'CASH_DISBURSEMENT',
  WAREHOUSE: 'WAREHOUSE',
  SITE_ENGINEER: 'SITE_ENGINEER'
};

exports.ResourceType = exports.$Enums.ResourceType = {
  MATERIAL: 'MATERIAL',
  LABOR: 'LABOR',
  EQUIPMENT: 'EQUIPMENT'
};

exports.MrStatus = exports.$Enums.MrStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED',
  FULFILLED: 'FULFILLED'
};

exports.RfqStatus = exports.$Enums.RfqStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  AWARDED: 'AWARDED'
};

exports.PoStatus = exports.$Enums.PoStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  ONLINE: 'ONLINE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Company: 'Company',
  Client: 'Client',
  Project: 'Project',
  ProjectMember: 'ProjectMember',
  BoqItem: 'BoqItem',
  BoqItemComponent: 'BoqItemComponent',
  MaterialRequest: 'MaterialRequest',
  MaterialRequestItem: 'MaterialRequestItem',
  RFQ: 'RFQ',
  RFQItem: 'RFQItem',
  Supplier: 'Supplier',
  Material: 'Material',
  Unit: 'Unit',
  Category: 'Category',
  Warehouse: 'Warehouse',
  SupplierQuotation: 'SupplierQuotation',
  QuotationItem: 'QuotationItem',
  PurchaseOrder: 'PurchaseOrder',
  PurchaseOrderItem: 'PurchaseOrderItem',
  ReceivingReport: 'ReceivingReport',
  ReceivingItem: 'ReceivingItem',
  InventoryItem: 'InventoryItem',
  WorkflowRule: 'WorkflowRule',
  SupplierInvoice: 'SupplierInvoice',
  Disbursement: 'Disbursement',
  FinancialTransaction: 'FinancialTransaction'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
