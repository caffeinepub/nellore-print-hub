import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Review {
    id: string;
    customerName: string;
    projectType: ServiceType;
    reviewText: string;
    imageUrl?: string;
    submissionDate: bigint;
    rating: bigint;
}
export interface QuotationDetails {
    terms: string;
    description: string;
    approvalTimestamp?: bigint;
    approved: boolean;
    replyFile?: ExternalBlob;
    price: bigint;
}
export interface OfficeLocation {
    lat: number;
    lon: number;
    address: string;
}
export interface AdminUser {
    principal?: Principal;
    active: boolean;
    registrationTimestamp: bigint;
    registrationMethod: string;
}
export interface AdminInvitationEntry {
    invitedBy?: Principal;
    email: string;
    invitationTimestamp: bigint;
    hashedPassword: string;
    registrationMethod: string;
}
export interface NegotiationMessage {
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface QuotationRequest {
    id: string;
    status: QuotationStatus;
    serviceType: ServiceType;
    customer: Principal;
    mobileNumber: string;
    deadline: bigint;
    email: string;
    negotiationHistory: Array<NegotiationMessage>;
    timestamp: bigint;
    projectDetails: string;
    quotationFileBlob?: ExternalBlob;
}
export interface ChatMessage {
    id: string;
    senderIsOwner: boolean;
    messageText: string;
    isReply: boolean;
    originalMessageId?: string;
    replyToMessageId?: string;
    timestamp: bigint;
    senderName: string;
    senderEmail: string;
}
export interface DeliveryConfig {
    minimumFee: bigint;
    perKmRate: bigint;
}
export interface Project {
    id: string;
    title: string;
    dateCompleted: bigint;
    description: string;
    imageUrl: string;
    category: ServiceType;
}
export interface ContactInfo {
    mapsLink: string;
    email: string;
    physicalAddress: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    mobileNumber: string;
    email: string;
}
export enum QuotationStatus {
    customerPending = "customerPending",
    completed = "completed",
    rejected = "rejected",
    workInProgress = "workInProgress",
    accepted = "accepted",
    draft = "draft",
    negotiating = "negotiating",
    paymentPending = "paymentPending"
}
export enum ServiceType {
    banner = "banner",
    offset = "offset",
    design = "design",
    digital = "digital"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInternetIdentityAdmin(principal: Principal): Promise<void>;
    addProject(imageUrl: string, title: string, description: string, category: ServiceType): Promise<string>;
    addQuotationDetails(quotationId: string, price: bigint, description: string, terms: string): Promise<void>;
    addReplyFile(quotationId: string, file: ExternalBlob): Promise<void>;
    addReview(customerName: string, reviewText: string, rating: bigint, imageUrl: string | null, projectType: ServiceType): Promise<string>;
    adminAcceptPayment(quotationId: string): Promise<void>;
    approveQuotation(quotationId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateDeliveryFee(distance: bigint): Promise<bigint>;
    createQuotationRequest(serviceType: ServiceType, deadline: bigint, projectDetails: string, mobileNumber: string, email: string, file: ExternalBlob | null): Promise<string>;
    customerApproveQuotation(quotationId: string): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    editProject(projectId: string, imageUrl: string, title: string, description: string, category: ServiceType): Promise<void>;
    getAdminInvitations(): Promise<Array<AdminInvitationEntry>>;
    getAdminPrincipals(): Promise<Array<AdminUser>>;
    getAdminUserCount(): Promise<bigint>;
    getAllChatMessages(): Promise<Array<ChatMessage>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllQuotations(): Promise<Array<QuotationRequest>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatsForCustomer(senderEmail: string): Promise<Array<ChatMessage>>;
    getContactInfo(): Promise<ContactInfo>;
    getCustomerChatHistory(senderEmail: string): Promise<{
        messages: Array<ChatMessage>;
        replies: Array<ChatMessage>;
    }>;
    getDeliveryConfig(): Promise<DeliveryConfig>;
    getLogo(): Promise<ExternalBlob | null>;
    getMyQuotations(): Promise<Array<QuotationRequest>>;
    getOfficeLocation(): Promise<OfficeLocation | null>;
    getPendingQuotationsOlderThan1Hour(): Promise<Array<string>>;
    getProjectsByCategory(category: ServiceType): Promise<Array<Project>>;
    getQuotationDetails(quotationId: string): Promise<QuotationDetails | null>;
    getQuotationStatistics(): Promise<{
        customerPending: bigint;
        completed: bigint;
        rejected: bigint;
        workInProgress: bigint;
        accepted: bigint;
        draft: bigint;
        negotiating: bigint;
        paymentPending: bigint;
    }>;
    getReplyFile(quotationId: string): Promise<ExternalBlob | null>;
    getReviewsByRating(rating: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handleQuotationResponse(quotationId: string, status: QuotationStatus, message: string | null): Promise<void>;
    inviteAdminUser(email: string, hashedPassword: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markQuotationCustomerPending(quotationId: string): Promise<void>;
    ownerReply(replyToMessageId: string, replyText: string): Promise<string>;
    registerBiometric(email: string): Promise<void>;
    respondToNegotiation(quotationId: string, message: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(senderName: string, senderEmail: string, messageText: string): Promise<string>;
    setDeliveryConfig(perKmRate: bigint, minimumFee: bigint): Promise<void>;
    setLogo(_logo: ExternalBlob): Promise<void>;
    setOfficeLocation(_location: OfficeLocation): Promise<void>;
    updateContactInfo(email: string, phone: string, physicalAddress: string, mapsLink: string): Promise<void>;
    verifyAuthentication(email: string, hashedPassword: string): Promise<boolean>;
}
