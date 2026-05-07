import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

describe("shadcn primitives", () => {
  it("renders the T02 baseline component set", () => {
    render(
      <div>
        <Button>Speichern</Button>
        <Label htmlFor="clinic-name">Klinik</Label>
        <Input id="clinic-name" placeholder="Klinikname" />
        <Textarea aria-label="Feedback" placeholder="Feedback" />

        <Dialog>
          <DialogTrigger>Dialog oeffnen</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pruefung</DialogTitle>
              <DialogDescription>
                Dialog primitive smoke test.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger>Filter oeffnen</PopoverTrigger>
          <PopoverContent>Filter</PopoverContent>
        </Popover>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Offen</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>,
    );

    expect(screen.getByRole("button", { name: "Speichern" })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByLabelText("Klinik")).toBeInTheDocument();
    expect(screen.getByLabelText("Feedback")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dialog oeffnen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Filter oeffnen" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Offen")).toBeInTheDocument();
  });
});
