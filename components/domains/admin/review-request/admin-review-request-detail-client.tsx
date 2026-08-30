"use client";

import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { runReviewRequestModerationAction } from "@/app/(admin)/admin/(protected)/review-request/[id]/actions";
import { CopyVerificationLinkButton } from "@/components/domains/admin/review-request/copy-verification-link-button";
import { ReviewRequestStatusBadge } from "@/components/domains/admin/review-requests/review-request-status-badge";
import { ReviewDetailView } from "@/components/domains/reviews/review-detail-view";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReviewRequest } from "@/lib/contracts/admin.schema";
import {
  affiliationEmailContent,
  affiliationEmailSubject,
  verificationEmailContent,
  verificationEmailSubject,
} from "@/lib/domains/admin/review-request/admin-email-templates";
import { isEmailInboxConfirmed } from "@/lib/domains/admin/review-request/is-email-inbox-confirmed";
import { reviewRequestToReviewDetail } from "@/lib/domains/admin/review-request/review-request-to-review-detail";
import {
  moderationActionsForStatus,
  type ModerationActionPresentation,
  type ModerationIntent,
} from "@/lib/domains/admin/review-request-actions";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatPublishDay(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function CopyField({
  label,
  text,
  copiedKey,
  copyKey,
  onCopy,
}: {
  label: string;
  text: string;
  copiedKey: string | null;
  copyKey: string;
  onCopy: (text: string, key: string) => void;
}) {
  const copied = copiedKey === copyKey;
  return (
    <div className="border-border bg-muted/30 rounded-md border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1 px-2"
          onClick={() => onCopy(text, copyKey)}
          aria-label={`${label} kopieren`}
        >
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <pre className="text-foreground max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm leading-snug">
        {text}
      </pre>
    </div>
  );
}

export function AdminReviewRequestDetailClient({
  request,
}: Readonly<{ request: ReviewRequest }>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAffiliationTemplate, setShowAffiliationTemplate] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<ModerationActionPresentation | null>(null);
  const [generatedVerifyUrl, setGeneratedVerifyUrl] = useState<string | null>(null);

  const emailCtx = { hospital: request.hospital, city: request.city, email: request.email };
  const detail = reviewRequestToReviewDetail(request);
  const actions = moderationActionsForStatus(request.requestStatus);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const runModeration = (intent: ModerationIntent) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", request.id);
      fd.set("intent", intent);
      const res = await runReviewRequestModerationAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleActionClick = (action: ModerationActionPresentation) => {
    if (action.confirm) {
      setPendingConfirm(action);
      return;
    }
    runModeration(action.intent);
  };

  const confirmPending = () => {
    if (!pendingConfirm) return;
    const intent = pendingConfirm.intent;
    setPendingConfirm(null);
    runModeration(intent);
  };

  return (
    <div className="text-foreground mx-auto w-full max-w-4xl">
      <nav className="text-muted-foreground mb-4 text-sm">
        <Link href="/admin" className="hover:text-foreground underline-offset-4 hover:underline">
          Admin
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <Link
          href="/admin/review-requests"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Bewertungsanfragen
        </Link>
        <span className="px-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">Anfrage</span>
      </nav>

      <section className="border-border bg-surface-lifted mb-6 rounded-lg border p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Moderation</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Eingereicht {formatDateTime(request.createdAt)}
              {request.updatedAt !== request.createdAt ? (
                <> · Aktualisiert {formatDateTime(request.updatedAt)}</>
              ) : null}
            </p>
          </div>
          <ReviewRequestStatusBadge status={request.requestStatus} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">E-Mail</dt>
            <dd className="font-medium break-all">
              {request.email}
              {isEmailInboxConfirmed(request.requestStatus) ? (
                <span className="mt-1 block text-sm font-medium text-blue-800">
                  Bestätigt (Link geklickt)
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Veröffentlichung geplant</dt>
            <dd className="font-medium">
              {request.publishAtDate ? formatPublishDay(request.publishAtDate) : "—"}
            </dd>
          </div>
        </dl>

        {actions.length > 0 ? (
          <div className="border-border mt-5 flex flex-wrap gap-2 border-t pt-5">
            {actions.map((action) => (
              <Button
                key={action.intent}
                type="button"
                variant={action.variant}
                disabled={pending}
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}

        {error ? (
          <p
            className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-md border px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </section>

      {request.requestStatus === "SUBMITTED" ? (
        <section className="border-border bg-surface-lifted mb-6 rounded-lg border p-5 shadow-sm">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-foreground text-lg font-semibold">E-Mail-Vorlage (Verifizierung)</h2>
            <CopyVerificationLinkButton
              requestId={request.id}
              label="Link erzeugen und kopieren"
              onCopied={setGeneratedVerifyUrl}
            />
          </div>
          {generatedVerifyUrl ? (
            <div className="mb-3">
              <CopyField
                label="Link"
                text={generatedVerifyUrl}
                copiedKey={copiedKey}
                copyKey="verify-url"
                onCopy={copyText}
              />
            </div>
          ) : null}
          <CopyField
            label="Betreff"
            text={verificationEmailSubject(emailCtx)}
            copiedKey={copiedKey}
            copyKey="verify-subj"
            onCopy={copyText}
          />
          <div className="mt-3">
            <CopyField
              label="Inhalt"
              text={verificationEmailContent({
                ...emailCtx,
                verificationUrl: generatedVerifyUrl,
              })}
              copiedKey={copiedKey}
              copyKey="verify-body"
              onCopy={copyText}
            />
          </div>
        </section>
      ) : null}

      {request.requestStatus === "EMAIL_VERIFIED" ? (
        <section className="border-border bg-surface-lifted mb-6 rounded-lg border p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-foreground text-lg font-semibold">Nachweis Zugehörigkeit</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAffiliationTemplate((v) => !v)}
            >
              {showAffiliationTemplate ? "Vorlage ausblenden" : "E-Mail-Vorlage anzeigen"}
            </Button>
          </div>
          {showAffiliationTemplate ? (
            <div className="mt-4 space-y-3">
              <CopyField
                label="Betreff"
                text={affiliationEmailSubject(emailCtx)}
                copiedKey={copiedKey}
                copyKey="aff-subj"
                onCopy={copyText}
              />
              <CopyField
                label="Inhalt"
                text={affiliationEmailContent(emailCtx)}
                copiedKey={copiedKey}
                copyKey="aff-body"
                onCopy={copyText}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      <ReviewDetailView review={detail} showBreadcrumb={false} />

      <Dialog
        open={pendingConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setPendingConfirm(null);
        }}
      >
        <DialogContent>
          {pendingConfirm?.confirm ? (
            <>
              <DialogHeader>
                <DialogTitle>{pendingConfirm.confirm.title}</DialogTitle>
                <DialogDescription>{pendingConfirm.confirm.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPendingConfirm(null)}
                  disabled={pending}
                >
                  Abbrechen
                </Button>
                <Button
                  type="button"
                  variant={pendingConfirm.variant}
                  onClick={confirmPending}
                  disabled={pending}
                >
                  {pendingConfirm.confirm.confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
