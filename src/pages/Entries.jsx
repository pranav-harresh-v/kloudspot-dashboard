import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEntries } from "../services/api";
import { useSite } from "../context/SiteContext";

const Entries = () => {
  const { selectedSite } = useSite();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    if (!selectedSite?.siteId) return;

    const fetchEntries = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const end = new Date(now.setHours(23, 59, 59, 999)).getTime();

        const response = await getEntries(
          start,
          end,
          selectedSite.siteId,
          page,
          PAGE_SIZE
        );

        setEntries(response.data?.records || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        console.error("Failed to load entries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedSite, page]);

  const formatTime = (utcVal) => {
    if (!utcVal) return "--";
    return new Date(utcVal).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPagination = () => {
    const pages = [];

    pages.push(
      <PageButton
        key={1}
        num={1}
        active={page === 1}
        onClick={() => setPage(1)}
      />
    );

    if (page > 3)
      pages.push(
        <span key="dots1" className="px-2 text-gray-400">
          ...
        </span>
      );

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(
        <PageButton
          key={i}
          num={i}
          active={page === i}
          onClick={() => setPage(i)}
        />
      );
    }

    if (page < totalPages - 2)
      pages.push(
        <span key="dots2" className="px-2 text-gray-400">
          ...
        </span>
      );

    if (totalPages > 1) {
      pages.push(
        <PageButton
          key={totalPages}
          num={totalPages}
          active={page === totalPages}
          onClick={() => setPage(totalPages)}
        />
      );
    }

    return pages;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Overview
        </h1>

        <div className="bg-white border px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2 cursor-pointer hover:border-teal-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <span>Today</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100/50 border-b border-gray-200 uppercase font-semibold text-xs tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Sex</th>
                <th className="px-6 py-4">Entry</th>
                <th className="px-6 py-4">Exit</th>
                <th className="px-6 py-4">Dwell Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400">
                    No visitors found today.
                  </td>
                </tr>
              ) : (
                entries.map((person) => (
                  <tr
                    key={person.personId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${person.personName}&background=random&color=fff&size=128`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full bg-gray-200"
                      />
                      {person.personName}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {person.personName.length % 2 === 0 ? "Female" : "Male"}
                    </td>

                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {formatTime(person.entryUtc)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {person.exitUtc ? formatTime(person.exitUtc) : "--"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {person.dwellMinutes
                        ? `${Math.round(person.dwellMinutes)}m`
                        : "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-2 select-none">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 text-gray-400 hover:text-kloud-primary disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {renderPagination()}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 text-gray-400 hover:text-kloud-primary disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PageButton = ({ num, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
      ${
        active
          ? "bg-kloud-primary text-white shadow-md"
          : "bg-transparent text-gray-600 hover:bg-gray-100"
      }`}
  >
    {num}
  </button>
);

export default Entries;
