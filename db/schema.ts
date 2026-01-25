import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  lastLoginMethod: text("last_login_method"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  isAcceptingMessages: boolean("is_accepting_messages").default(true).notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = pgTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
  initiatedConversations: many(conversation, { relationName: "initiatedConversations" }),
  receivedConversations: many(conversation, { relationName: "receivedConversations" }),
  messages: many(message),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

// --- CONVERSATIONS TABLE ---
// This acts as the "Thread" between the anonymous sender and the receiver
export const conversation = pgTable(
  "conversation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("conversation_participants_idx").on(table.senderId, table.receiverId),
  ],
);

export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("message_conversationId_idx").on(table.conversationId)],
);

// --- RELATIONS ---

// This tells Drizzle how to join these tables together
export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    sender: one(user, {
      fields: [conversation.senderId],
      references: [user.id],
      relationName: "initiatedConversations",
    }),
    receiver: one(user, {
      fields: [conversation.receiverId],
      references: [user.id],
      relationName: "receivedConversations",
    }),
    messages: many(message),
  }),
);

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  author: one(user, {
    fields: [message.authorId],
    references: [user.id],
  }),
}));


export const schema = {
  user,
  session,
  account,
  verification,
  organization, 
  member,      
  invitation, 
  conversation,
  message,
  userRelations,
  sessionRelations,
  accountRelations,
  organizationRelations,
  memberRelations,
  invitationRelations,
  conversationRelations,
  messageRelations,
};

// BetterAuth Tables INSERT Types and Schema Genreation using drizzle-zod

export const userInsertSchema = createInsertSchema(user);
export type UserInsertType = z.infer<typeof userInsertSchema>;

export const sessionInsertSchema = createInsertSchema(session);
export type SessionInsertType = z.infer<typeof sessionInsertSchema>;

export const accountInsertSchema = createInsertSchema(account);
export type AccountInsertType = z.infer<typeof accountInsertSchema>;

export const verificationInsertSchema = createInsertSchema(verification);
export type VerificationInsertType = z.infer<typeof verificationInsertSchema>;

export const messageInsertSchema = createInsertSchema(message);
export type MessageInsertType = z.infer<typeof messageInsertSchema>;

export const conversationInsertSchema = createInsertSchema(conversation);
export type ConversationInsertType = z.infer<typeof conversationInsertSchema>;

// BetterAuth Tables UPDATE Types and Schema Genreation using drizzle-zod

export const userUpdateSchema = createUpdateSchema(user);
export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export const sessionUpdateSchema = createUpdateSchema(session);
export type SessionUpdateType = z.infer<typeof sessionUpdateSchema>;

export const accountUpdateSchema = createUpdateSchema(account);
export type AccountUpdateType = z.infer<typeof accountUpdateSchema>;

export const verificationUpdateSchema = createUpdateSchema(verification);
export type VerificationUpdateType = z.infer<typeof verificationUpdateSchema>;

export const messageUpdateSchema = createUpdateSchema(message);
export type MessageUpdateType = z.infer<typeof messageUpdateSchema>;

export const conversationUpdateSchema = createUpdateSchema(conversation);
export type ConversationUpdateType = z.infer<typeof conversationUpdateSchema>;

// BetterAuth Tables SELECT Types and Schema Genreation using drizzle-zod

export const userSelectSchema = createSelectSchema(user);
export type UserSelectType = z.infer<typeof userSelectSchema>;

export const messageSelectSchema = createSelectSchema(message);
export type MessageSelectType = z.infer<typeof messageSelectSchema>;

export const conversationSelectSchema = createSelectSchema(conversation);
export type ConversationSelectType = z.infer<typeof conversationSelectSchema>;



// when user A sends a message to user B,
// we will create a conversation table which mainly contains the userId of both users,
// and then we will generate a message table which will contain conversationID of previously created conversation table, this new message table contains field like authorId, message content, creationdate...obviously the first authorId belongs to anonymous sender who started the conversation.