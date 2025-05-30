"use client";

import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { IoSearch, IoTrash, IoMedkit } from "react-icons/io5";
import axios from "axios";
import Pagination from "../components/paginate/paginate";
import InputSearch from "../components/form/inputSearch";
import { TableSkeleton } from "../components/skeleton/skeletonAdmin";
import Table from "../components/tabel/tabel";
import { HighlightText } from "../components/handle/handleSearch";
import HanldeLogout from "../components/handle/handleLogout";
import { FormatDate } from "../components/formatDate/formatDate";
import Header from "@/components/header/header";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataToRemove, setDataToRemove] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  //use state untuk pagination
  const [rows, setRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const targetRef = useRef(null);

  // Menghitung indeks awal dan akhir untuk menampilkan nomber
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Data yang disimpan dalam state
  //set untuk page yg di tampilkan
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //toast data baru
  useEffect(() => {
    const newData = localStorage.getItem("newData");
    if (newData) {
      toast.success(newData);
      localStorage.removeItem("newData");
    }
  }, []);

  //setiap kali ada perubahan di current page maka scroll ke atas
  useEffect(() => {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  // useEffect untuk search
  useEffect(() => {
    setSearchQuery(users);
  }, [users]);

  // function mengambil data outlet by limit
  const fetchDataPaginated = async (isSearchMode = false) => {
    setIsLoading(true);

    const pageToFetch = isSearchMode ? 1 : currentPage;
    if (isSearchMode) {
      setCurrentPage(1);
    }

    const params = {
      page: pageToFetch,
      limit: itemsPerPage,
      search: query.toLowerCase(),
    };
    try {
      // Mengambil data transaksi menggunakan axios dengan query params
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/user/getAllUserByPaginated`,
        {
          params: params,
        }
      );

      const data = response.data.data;
      const pagination = response.data.pagination;

      // Jika current page melebihi totalPages, set ulang currentPage saja
      if (
        !isSearchMode &&
        pagination.totalPages > 0 &&
        pageToFetch > pagination.totalPages
      ) {
        setCurrentPage(pagination.totalPages);
        return; // jangan lanjutkan render, tunggu useEffect panggil ulang
      }
      setUsers(data);
      setRows(pagination.totalItems);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchDataPaginated();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [itemsPerPage, currentPage]);

  //handle untuk menghapus data
  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/user/deleteUser/${dataToRemove}`
      );

      if (response.status === 200) {
        await fetchDataPaginated();
        setShowConfirmModal(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemove = (dataRemove) => {
    setDataToRemove(dataRemove);
    setShowConfirmModal(true);
  };

  const columns = [
    {
      id: "No",
      header: "No",
      cell: ({ row }) => indexOfFirstItem + row.index + 1,
    },
    {
      header: "First name",
      accessorKey: "firstname",
      cell: ({ getValue }) => HighlightText(getValue(), query),
    },
    {
      header: "Last name",
      accessorKey: "lastname",
    },
    {
      header: "Birthdate",
      accessorKey: "birthdate",
      cell: ({ getValue }) => FormatDate(getValue()),
    },
    {
      header: "Address",
      accessorFn: (row) => {
        const address = row.Address;
        return `${address?.street} ${address?.city} ${address?.province} ${address?.postal_code}`;
      },
    },
    {
      header: "Action",
      id: "Action",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <a
            href={`/edit?id=${row.original.id}`}
            onClick={() => localStorage.setItem("user_id", row.original.id)}
            className="text-sm text-white p-1 rounded-sm bg-blue-500 cursor-pointer"
          >
            <AiFillEdit />
          </a>
          <button
            className="text-sm text-white p-1 rounded-sm bg-red-500 cursor-pointer"
            onClick={() => confirmRemove(row.original.id)}
          >
            <IoTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div
        ref={targetRef}
        className=" pl-5 pt-20 pb-8 w-full bg-white overflow-auto  "
      >
        <Toaster position="top-center" reverseOrder={false} />
        <div className=" pr-2 ">
          <h1 className="my-2 md:my-5 font-nunitoSans text-darkgray body-text-base-bold text-lg md:text-xl">
            Users Data Settings
          </h1>
          <div>
            <InputSearch
              type="text"
              placeholder="Outlet Name. . ."
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onRightButtonCLick={() => fetchDataPaginated(true)}
              rightButton={<IoSearch />}
              createData={<IoMedkit />}
              linkCreate={"/create"}
              isLoading={isLoading}
            />
          </div>

          <div className="rounded-lg shadow-lg bg-white overflow-x-auto ">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Table data={searchQuery} columns={columns} />
            )}
          </div>

          {/* Tampilkan navigasi pagination */}
          {searchQuery.length > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              rows={rows}
              paginate={paginate}
              currentPage={currentPage}
              isLoading={isLoading}
            />
          )}

          {/* modal konfirmasi delete */}
          {showConfirmModal && (
            <HanldeLogout
              handleRemove={handleRemove}
              setShowConfirmModal={() => setShowConfirmModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}
