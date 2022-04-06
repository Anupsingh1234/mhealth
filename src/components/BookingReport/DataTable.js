import classNames from "classnames";

export default function DataTable({ bookingDetail, updateStatus }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="min-w-[12rem] px-3 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Health Package Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={classNames("divide-y divide-gray-200 bg-white")}
                >
                  {bookingDetail.map((person) => {
                    return (
                      <tr key={person.email}>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 pr-3 text-sm font-medium",
                            "text-gray-900",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.userDetail.firstName +
                            " " +
                            person.userDetail.lastName}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.userDetail.emailId}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.userDetail.gender}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.userDetail.mobileNumber}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.healthPackageName}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.bookingDate}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.bookingTime}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.bookingType}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {person.bookingStatus}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                            { "bg-blue-200": person.bookingStatus === "OPEN" },
                            {
                              "bg-amber-200":
                                person.bookingStatus === "PENDING",
                            },
                            { "bg-red-200": person.bookingStatus === "ABSENT" }
                          )}
                        >
                          {!["COMPLETED", "CANCELLED", "ABSENT"].includes(
                            person.bookingStatus
                          ) && (
                            <button
                              style={{
                                background: "green",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: 24,
                              }}
                              onClick={() => updateStatus(person)}
                            >
                              Change status
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
