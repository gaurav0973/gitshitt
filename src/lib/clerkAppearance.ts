export const clerkSignInAppearance = {
  variables: {
    colorPrimary: "#8b5cf6",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#1e293b",
    colorText: "#1e293b",
    colorTextSecondary: "#64748b",
    borderRadius: "16px",
    fontFamily: "var(--font-body), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-body), system-ui, sans-serif",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full",
    card: "w-full gap-4 border-0 bg-transparent p-0 shadow-none",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "rounded-full border-2 border-foreground bg-transparent font-bold text-foreground shadow-none transition-colors hover:bg-tertiary",
    dividerLine: "bg-border",
    dividerText:
      "text-xs font-bold uppercase tracking-wider text-muted-foreground",
    formFieldLabel:
      "text-xs font-bold uppercase tracking-[0.06em] text-foreground",
    formFieldInput:
      "rounded-2xl border-2 border-border bg-input text-foreground shadow-none focus:border-accent focus:shadow-[4px_4px_0_0_#8b5cf6]",
    formButtonPrimary:
      "rounded-full border-2 border-foreground bg-accent font-bold text-white shadow-[4px_4px_0_0_#1e293b] transition-[transform,box-shadow] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#1e293b]",
    footerActionText: "text-sm text-muted-foreground",
    footerActionLink: "font-bold text-accent hover:text-accent",
    formFieldAction: "font-bold text-accent hover:text-accent",
    identityPreviewEditButton: "font-bold text-accent hover:text-accent",
    formResendCodeLink: "font-bold text-accent hover:text-accent",
    footer: "bg-transparent pt-2",
    logoBox: "hidden",
  },
};
