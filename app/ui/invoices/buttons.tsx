"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice } from "@/app/lib/actions";
import { useRef, useState } from "react";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// export function DeleteInvoice({ id }: { id: string }) {
//   const deleteInvoiceWithId = deleteInvoice.bind(null, id);
//   return (
//     <form action={deleteInvoiceWithId}>
//       <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
//         <span className="sr-only">Delete</span>
//         <TrashIcon className="w-4" />
//       </button>
//     </form>
//   );
// }
export function DeleteInvoice({ id }: { id: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    formRef.current?.requestSubmit();
    setShowModal(false);
  };

  return (
    <>
      {/* Tombol delete */}
      <form
        ref={formRef}
        action={deleteInvoice.bind(null, id)}
        className="inline"
      >
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-4" />
        </button>
      </form>

      {/* Modal konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Yakin ingin menghapus?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
