import React, { useState } from "react";
import Modal from "../components/Modal";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HoursRecord = () => {
  const navigate = useNavigate();
  let user;
  // let records;
  let recordCards;
  const updateRecord = async () => {};

  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("idle");

  const checkUser = async () => {
    setStatus("loading");
    user = await (await fetch("/api/login/users/current")).json();
    console.log("USER IS", user);
    if (user !== undefined && user !== null && user.role !== undefined) {
      if (user.role === "employer") {
        // TODO: Navigate employer to employer page
        console.log("THIS IS AN EMPLOYER");
      }
      try {
        const data = await (await fetch("/api/records/" + user.id)).json();
        console.log(data);
        setRecords(data);
        setStatus("success");
      } catch (error) {
        setStatus("Error");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const [open, setOpen] = useState(false);
  //Enter time manually
  const [manualHours, setManualHours] = useState("");
  const handleManualHoursInput = (e) => {
    if (!isNaN(e.target.value)) {
      setManualHours(e.target.value);
    }
  };
  const message = useRef();
  const handleSubmitEditedTime = () => {
    if (manualHours === "") {
      return;
    }
    console.log(manualHours);
    console.log(message.current.value);

    setManualHours("");
    message.current.value = "";
    setOpen(false);
  };
  const renderRecords = () => {
    switch (status) {
      case "loading":
        return <div>Loading</div>;
      case "error":
        return <div>Error</div>;
      case "success":
        console.log("was i ehre");
        return records.map((item) => {
          return (
            <div key={item.id}>
              <h5>{item.date}</h5>
              <h5>{item.notes}</h5>
            </div>
          );
        });
      default:
        return <div>Idle...</div>;
    }
  };
  return (
    <div
      className="overflow-y-auto w-full flex flex-col items-center"
      style={{ maxHeight: "calc(100vh - 5rem)" }}
    >
      <h1 className=" text-4xl mt-8 text-center">My Hours</h1>
      {renderRecords()}
      <div className="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-6 pb-0">
          <div className="flex justify-between">
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              Sep 11 2023
            </h5>
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              11h20m
            </h5>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sunt
            saepe laborum expedita ipsa odio aspernatur optio architecto hic
            mollitia, unde quia praesentium et. Sunt maiores id tenetur nam
            incidunt!
          </p>
        </div>
        <div className="p-6 pt-4">
          <a
            className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500 cursor-default"
            href="#"
          >
            <button
              className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-ripple-dark="true"
              onClick={() => setOpen(true)}
            >
              Edit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                ></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <div className="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-6 pb-0">
          <div className="flex justify-between">
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              Sep 11 2023
            </h5>
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              11h20m
            </h5>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sunt
            saepe laborum expedita ipsa odio aspernatur optio architecto hic
            mollitia, unde quia praesentium et. Sunt maiores id tenetur nam
            incidunt!
          </p>
        </div>
        <div className="p-6 pt-4">
          <a
            className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500 cursor-default"
            href="#"
          >
            <button
              className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-ripple-dark="true"
              onClick={() => setOpen(true)}
            >
              Edit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                ></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <div className="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-6 pb-0">
          <div className="flex justify-between">
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              Sep 11 2023
            </h5>
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              11h20m
            </h5>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sunt
            saepe laborum expedita ipsa odio aspernatur optio architecto hic
            mollitia, unde quia praesentium et. Sunt maiores id tenetur nam
            incidunt!
          </p>
        </div>
        <div className="p-6 pt-4">
          <a
            className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500 cursor-default"
            href="#"
          >
            <button
              className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-ripple-dark="true"
              onClick={() => setOpen(true)}
            >
              Edit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                ></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <div className="relative mt-6 mb-12 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="p-6 pb-0">
          <div className="flex justify-between">
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              Sep 11 2023
            </h5>
            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              11h20m
            </h5>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sunt
            saepe laborum expedita ipsa odio aspernatur optio architecto hic
            mollitia, unde quia praesentium et. Sunt maiores id tenetur nam
            incidunt!
          </p>
        </div>
        <div className="p-6 pt-4">
          <a
            className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500 cursor-default"
            href="#"
          >
            <button
              className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              data-ripple-dark="true"
              onClick={() => setOpen(true)}
            >
              Edit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                ></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-64 flex flex-col justify-center">
          <h1 className="text-4xl mb-4 text-center">Edit your time</h1>
          <form className="flex flex-col gap-7 justify-center">
            <div className="flex gap-3 justify-center items-center">
              <label>Date: </label>
              <input name="date" type="date" required />
            </div>
            <div className="">
              <div className="relative h-11 w-full min-w-[180]">
                <input
                  placeholder="hours"
                  className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  type="text"
                  value={manualHours}
                  onChange={(e) => handleManualHoursInput(e)}
                />
                <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Enter your hours
                </label>
              </div>
            </div>
            <div className="">
              <div className="relative w-full min-w-[200px]">
                <textarea
                  ref={message}
                  className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                ></textarea>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Enter your note
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="block w-full select-none rounded-lg bg-teal-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                data-ripple-light="true"
                onClick={handleSubmitEditedTime}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default HoursRecord;
