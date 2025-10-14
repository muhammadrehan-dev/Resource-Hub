// Prevent Monaco from loading in server builds (Vercel)
if (typeof window === "undefined") {
  global.window = {};
}

import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || 
               process.env.VERCEL_GIT_COMMIT_REF || 
               process.env.HEAD || 
               "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "", // Get this from tina.io
  token: process.env.TINA_TOKEN || "", // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "",
  },
  media: {
    tina: {
      mediaRoot: "content/uploads",
      publicFolder: "",
    },
  },
  schema: {
    collections: [
      {
        name: "news",
        label: "News & Announcements",
        path: "content/news",
        format: "md",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              const date = new Date(values?.date || new Date());
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}-${values?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
              timeFormat: 'HH:mm',
            },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { value: "General Update", label: "General Update" },
              { value: "Urgent", label: "Urgent" },
              { value: "Exam", label: "Exam" },
              { value: "Assignment", label: "Assignment" },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
            description: "Show this news prominently",
          },
          {
            type: "boolean",
            name: "sendNotification",
            label: "Send Push Notification",
            description: "Send notification to all subscribers when published",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
            required: true,
          },
        ],
      },
      {
        name: "deadlines",
        label: "Assignment Deadlines",
        path: "content/deadlines",
        format: "md",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              const subject = values?.subject?.toLowerCase().replace(/\s+/g, '-') || 'assignment';
              const title = values?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'deadline';
              return `${subject}-${title}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Assignment Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "subject",
            label: "Subject",
            required: true,
            options: [
              "Applied Physics",
              "ICT",
              "Programming",
              "English",
              "Calculus",
              "Islamiat",
            ],
          },
          {
            type: "datetime",
            name: "dueDate",
            label: "Due Date & Time",
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
              timeFormat: 'HH:mm',
            },
          },
          {
            type: "string",
            name: "priority",
            label: "Priority",
            required: true,
            options: [
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          },
          {
            type: "string",
            name: "submissionLink",
            label: "Submission Link (Optional)",
            description: "Link where students submit their work",
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            isBody: true,
            required: true,
          },
        ],
      },
      {
        name: "subjects",
        label: "Subject Materials",
        path: "subjects",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Subject Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "driveLink",
            label: "Google Drive Folder Link",
            description: "Main Google Drive folder for this subject",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Additional Information",
            isBody: true,
          },
        ],
      },
    ],
  },
});
