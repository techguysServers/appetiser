import { Bolt, Check, CircleAlert, Copy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ShareDialog({
  children,
  open,
  onOpenChange,
  name,
  id,
  hasSignLink,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  name: string;
  id: string;
  hasSignLink?: boolean;
}) {
  const [link, setLink] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleLinkGeneration = async () => {
    setGenerating(true);

    const supabase = createClient();

    const user = await supabase.auth.getUser();

    if (!user.data.user?.id) {
      return;
    }

    const { data, error } = await supabase
      .from("estimates_tokens")
      .upsert(
        { estimate_id: id, user_id: user.data.user.id },
        { onConflict: "estimate_id" }
      )
      .select("*")
      .single();

    if (error) {
      console.error("Error generating link:", error);
      setGenerating(false);
      return;
    }

    if (data) {
      setLink(`${process.env.NEXT_PUBLIC_APP_URL}/e/${id}?token=${data.token}`);
    }

    setGenerating(false);
  };

  useEffect(() => {
    const fetchLink = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("estimates_tokens")
        .select("*")
        .eq("estimate_id", id)
        .single();
      if (error) {
        // If there is 0 row, error is triggered (see .single())
        return;
      }
      if (data) {
        setLink(
          `${process.env.NEXT_PUBLIC_APP_URL}/e/${id}?token=${data.token}`
        );
      }
    };

    fetchLink();
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {name}</DialogTitle>
          <DialogDescription>
            Generate and share the link to your estimate
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            type="text"
            readOnly
            value={
              link || `${process.env.NEXT_PUBLIC_APP_URL}/••••••••••••/•••••••`
            }
            disabled={!link}
            className="flex-1"
          />
          {link ? (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              disabled={copied}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={handleLinkGeneration}
                  disabled={generating}
                >
                  <Bolt className={generating ? "animate-spin" : ""} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate public link</TooltipContent>
            </Tooltip>
          )}
        </div>
        {hasSignLink && (
          <p className="text-sm text-muted-foreground mt-2">
            <CircleAlert /> Be careful with this link, we detected a signing
            link associated with this estimage. Anyone with this link will be
            able to sign the estimate. Share it only with trusted parties.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
