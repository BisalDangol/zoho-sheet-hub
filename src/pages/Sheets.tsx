import { useEffect, useState } from "react";
import { Plus, Search, ExternalLink, RefreshCw, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SheetsService, SheetInfo, SheetData } from "@/services/sheetsService";

export default function Sheets() {
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<SheetInfo | null>(null);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sheetId = "10VOec--dmuoUZxgTQyjBisSea80aGxA_tKJzr63CqtM"; // Hardcoded for now
  const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const metadata = await SheetsService.fetchSheetMetadata(sheetId);
        setSheets(metadata.sheets);
      } catch (err) {
        setError('Failed to load sheets');
        console.error('Error fetching sheets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [sheetId]);

  const handleSheetClick = async (sheet: SheetInfo) => {
    try {
      setDataLoading(true);
      setSelectedSheet(sheet);
      // Fetch all data from the sheet (assuming it starts from A1)
      const range = `${sheet.title}!A:Z`; // Adjust range as needed
      const data = await SheetsService.fetchSheetData(sheetId, range);
      setSheetData(data);
    } catch (err) {
      setError('Failed to load sheet data');
      console.error('Error fetching sheet data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedSheet(null);
    setSheetData(null);
  };

  if (selectedSheet && sheetData) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sheets
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{selectedSheet.title}</h1>
              <p className="mt-1 text-muted-foreground">Sheet data from Google Sheets</p>
            </div>
          </div>

          {/* Data Table */}
          <Card className="border-border/50 shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle>Sheet Data</CardTitle>
              <CardDescription>
                {sheetData.data.length} records found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="text-center py-8">Loading data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {sheetData.headers.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetData.data.slice(0, 100).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {sheetData.headers.map((header, colIndex) => (
                            <TableCell key={colIndex}>{row[header] || ''}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {sheetData.data.length > 100 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Showing first 100 rows. Total: {sheetData.data.length} rows.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Sheets</h1>
            <p className="mt-1 text-muted-foreground">Manage and sync your Google Sheets data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Master Sheet
              </a>
            </Button>
            <Button className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Connect Sheet
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search sheets..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Sheets Grid */}
        {loading ? (
          <div className="text-center py-8">Loading sheets...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sheets.map((sheet, index) => (
              <Card
                key={sheet.sheetId}
                className="border-border/50 shadow-soft hover:shadow-glow transition-shadow cursor-pointer animate-fade-in"
                style={{ animationDelay: `${200 + index * 100}ms` }}
                onClick={() => handleSheetClick(sheet)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                      Available
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-lg">{sheet.title}</CardTitle>
                  <CardDescription>Click to view sheet data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {sheet.gridProperties?.rowCount || 'Unknown'} rows
                    </span>
                    <span className="text-muted-foreground">
                      {sheet.gridProperties?.columnCount || 'Unknown'} columns
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
