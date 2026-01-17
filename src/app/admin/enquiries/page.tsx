"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Calendar, MapPin, Activity, Globe, RefreshCw, CheckCircle, Clock, Archive } from "lucide-react";

interface Enquiry {
  id: string;
  siteId: string;
  sourcePage: string | null;
  destinationId: string | null;
  activityId: string | null;
  name: string;
  email: string;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  message: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ParsedItem {
  name: string;
  location?: string;
  price?: string;
  id?: string;
}

interface ParsedResult {
  original: string;
  activities: ParsedItem[];
  destinations: ParsedItem[];
  summary: Record<string, string> | null;
  siteInfo: Record<string, string> | null;
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuth");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!isAuthenticated || !authTime) {
      router.push("/admin");
      return;
    }
    
    // Check if session is older than 24 hours
    const hoursSinceAuth = (Date.now() - parseInt(authTime)) / (1000 * 60 * 60);
    if (hoursSinceAuth > 24) {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminAuthTime");
      router.push("/admin");
      return;
    }
    
    fetchEnquiries();
  }, [router]);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/admin/enquiries");
      if (response.ok) {
        const data = await response.json() as Enquiry[];
        setEnquiries(data);
      } else {
        console.error("Failed to fetch enquiries:", await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setEnquiries(prev =>
          prev.map(enq => enq.id === id ? { ...enq, status, updatedAt: new Date() } : enq)
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(prev => prev ? { ...prev, status, updatedAt: new Date() } : null);
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to update status:", response.status, errorText);
        alert(`Failed to update status: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = filterStatus === "all" || enq.status === filterStatus;
    const matchesSearch = !searchTerm || 
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qualified": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="w-4 h-4" />;
      case "contacted": return <Mail className="w-4 h-4" />;
      case "qualified": return <CheckCircle className="w-4 h-4" />;
      case "closed": return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const statusCounts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === "new").length,
    contacted: enquiries.filter(e => e.status === "contacted").length,
    qualified: enquiries.filter(e => e.status === "qualified").length,
    closed: enquiries.filter(e => e.status === "closed").length,
  };

  const parseMessage = (message: string | null): ParsedResult => {
    if (!message) return { original: "", activities: [], destinations: [], summary: null, siteInfo: null };

    const lines = message.split("\n");
    let original = "";
    const activities: ParsedItem[] = [];
    const destinations: ParsedItem[] = [];
    let summary: Record<string, string> | null = null;
    let siteInfo: Record<string, string> | null = null;

    let inActivities = false;
    let inDestinations = false;
    let inSummary = false;
    let inSiteInfo = false;
    let currentItem: ParsedItem | null = null;

    for (const line of lines) {
      if (line.includes("SELECTED ITEMS FROM")) {
        inActivities = false;
        inDestinations = false;
        continue;
      }
      
      if (line.includes("🎯 ACTIVITIES")) {
        inActivities = true;
        inDestinations = false;
        continue;
      }
      
      if (line.includes("🌍 DESTINATIONS")) {
        inActivities = false;
        inDestinations = true;
        continue;
      }
      
      if (line.includes("📊 SUMMARY:")) {
        inActivities = false;
        inDestinations = false;
        inSummary = true;
        summary = {};
        continue;
      }
      
      if (line.includes("🏢 ENQUIRY INFORMATION")) {
        inSummary = false;
        inSiteInfo = true;
        siteInfo = {};
        continue;
      }
      
      if (line.includes("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")) {
        if (!inActivities && !inDestinations && !inSummary && !inSiteInfo) {
          original += line + "\n";
        }
        continue;
      }
      
      if (inActivities || inDestinations) {
        if (line.match(/^\d+\./)) {
            if (currentItem) {
              if (inActivities) activities.push(currentItem);
              else destinations.push(currentItem);
            }
            currentItem = { name: line.replace(/^\d+\.\s*/, "").trim() };
        } else if (currentItem) {
          if (line.includes("📍 Location:")) {
              currentItem.location = line.replace("📍 Location:", "").trim();
          } else if (line.includes("💰 Price:")) {
              currentItem.price = line.replace("💰 Price:", "").trim();
          } else if (line.includes("🆔 ID:")) {
              currentItem.id = line.replace("🆔 ID:", "").trim();
          }
        }
      } else if (!inSummary && !inSiteInfo && line.trim()) {
        original += line + "\n";
      }
    }
    
    if (currentItem) {
        if (inActivities) activities.push(currentItem);
        else if (inDestinations) destinations.push(currentItem);
    }
    
      return { original: original.trim(), activities, destinations, summary, siteInfo };
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminAuthTime");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Enquiries Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage customer enquiries and bookings</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { key: "all", label: "All", count: statusCounts.all, color: "bg-gray-50 border-gray-200" },
            { key: "new", label: "New", count: statusCounts.new, color: "bg-blue-50 border-blue-200" },
            { key: "contacted", label: "Contacted", count: statusCounts.contacted, color: "bg-yellow-50 border-yellow-200" },
            { key: "qualified", label: "Qualified", count: statusCounts.qualified, color: "bg-green-50 border-green-200" },
            { key: "closed", label: "Closed", count: statusCounts.closed, color: "bg-gray-50 border-gray-300" },
          ].map(stat => (
            <button
              key={stat.key}
              onClick={() => setFilterStatus(stat.key)}
              className={`${stat.color} ${filterStatus === stat.key ? 'ring-2 ring-blue-500' : ''} border-2 rounded-xl p-4 text-left transition-all hover:shadow-md`}
            >
              <div className="text-2xl font-black text-gray-900">{stat.count}</div>
              <div className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enquiries List */}
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => (
              <button
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className={`w-full text-left bg-white rounded-xl p-5 border-2 transition-all hover:shadow-lg ${
                  selectedEnquiry?.id === enquiry.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{enquiry.name}</h3>
                    <p className="text-sm text-gray-600">{enquiry.email}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(enquiry.status)}`}>
                    {getStatusIcon(enquiry.status)}
                    {enquiry.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {enquiry.siteId}
                  </span>
                </div>
                
                {enquiry.message && (
                  <p className="text-sm text-gray-700 line-clamp-2">{enquiry.message.split("\n")[0]}</p>
                )}
              </button>
            ))}
            
            {filteredEnquiries.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
                <p className="text-gray-500">No enquiries found</p>
              </div>
            )}
          </div>

          {/* Enquiry Details */}
          <div className="lg:sticky lg:top-24 h-fit">
            {selectedEnquiry ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <h2 className="text-2xl font-black mb-2">{selectedEnquiry.name}</h2>
                  <div className="space-y-1 text-blue-100 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedEnquiry.email}
                    </p>
                    {selectedEnquiry.phoneNumber && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedEnquiry.phoneCountryCode} {selectedEnquiry.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Update Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["new", "contacted", "qualified", "closed"].map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedEnquiry.id, status)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            selectedEnquiry.status === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Site Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Source Information
                    </h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><strong>Site:</strong> {selectedEnquiry.siteId}</p>
                      <p><strong>Page:</strong> {selectedEnquiry.sourcePage || "N/A"}</p>
                      <p><strong>Submitted:</strong> {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                      <p><strong>Last Updated:</strong> {new Date(selectedEnquiry.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Selected Items */}
                  {(() => {
                    const parsed = parseMessage(selectedEnquiry.message);
                    return (
                      <>
                        {parsed.activities.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-600" />
                              Selected Activities ({parsed.activities.length})
                            </h3>
                            <div className="space-y-3">
                              {parsed.activities.map((item: ParsedItem, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  {item.location && <p className="text-sm text-gray-600">📍 {item.location}</p>}
                                  {item.price && <p className="text-sm text-gray-900 font-semibold">💰 {item.price}</p>}
                                  {item.id && <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsed.destinations.length > 0 && (
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-indigo-600" />
                              Selected Destinations ({parsed.destinations.length})
                            </h3>
                            <div className="space-y-3">
                              {parsed.destinations.map((item: ParsedItem, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-3 border border-indigo-100">
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  {item.price && <p className="text-sm text-gray-900 font-semibold">💰 {item.price}</p>}
                                  {item.id && <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsed.original && (
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">Customer Message</h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                              {parsed.original}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <p className="text-gray-500">Select an enquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
