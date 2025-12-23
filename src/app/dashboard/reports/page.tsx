'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateTo: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير</h1>
            <p className="text-gray-600">
              أنشئ وصدّر تقارير PDF احترافية بهوية متجرك
            </p>
          </div>
          <button
            onClick={createReport}
            disabled={creating}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {creating ? 'جاري الإنشاء...' : 'إنشاء تقرير جديد'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد تقارير بعد
            </h3>
            <p className="text-gray-600 mb-6">
              ابدأ بإنشاء أول تقرير لك
            </p>
            <button
              onClick={createReport}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              إنشاء تقرير
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: any }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-4">
        <FileText className="w-10 h-10 text-primary-600" />
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
          {report.reportId}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 mb-2">
        تقرير الأداء
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(report.dateFrom)} - {formatDate(report.dateTo)}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          تم الإنشاء: {formatDate(report.createdAt)}
        </p>
      </div>

      {report.pdfUrl && (
        <a
          href={report.pdfUrl}
          download
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition w-full justify-center"
        >
          <Download className="w-4 h-4" />
          تحميل PDF
        </a>
      )}
    </div>
  );
}
