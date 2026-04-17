import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import type { DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import type { ColumnFilterElementTemplateOptions } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Slider } from "primereact/slider";
import { Tag } from "primereact/tag";
import {
  Button,
  Modal,
  Select,
  TextInput,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { getDoctorDropdown } from "../../../Service/DoctorProfileService";
import { scheduleAppointment } from "../../../Service/AppointmentService";

interface Country {
  name: string;
  code: string;
}

interface Representative {
  name: string;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

interface DoctorOption {
  value: string;
  label: string;
}

interface RootState {
  user?: {
    profileId?: string | number;
  };
}

interface AppointmentFormValues {
  doctorId: string;
  patientId: string;
  appointmentTime: Date | string | null;
  reason: string;
  notes: string;
}

type Severity =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "secondary"
  | "contrast"
  | null;

const appointmentReasons = [
  { value: "consultation", label: "Consultation" },
  { value: "follow_up", label: "Follow Up" },
  { value: "checkup", label: "General Checkup" },
  { value: "prescription", label: "Prescription Review" },
  { value: "test_results", label: "Discuss Test Results" },
];

const successNotification = (message: string) => {
  console.log(message);
};

const errorNotification = (message: string) => {
  console.error(message);
};

const Appointment = () => {
  const user = useSelector((state: RootState) => state.user);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<AppointmentFormValues>({
    initialValues: {
      doctorId: "",
      patientId: String(user?.profileId ?? ""),
      appointmentTime: new Date(),
      reason: "",
      notes: "",
    },
    validate: {
      doctorId: (value) => (!value ? "Doctor is required" : undefined),
      appointmentTime: (value) =>
        !value ? "Appointment time is required" : undefined,
      reason: (value) =>
        !value ? "Reason for appointment is required" : undefined,
      notes: (value) =>
        !value.trim() ? "Additional notes are required" : undefined,
    },
  });

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
  });

  const representatives: Representative[] = [
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ];

  const statuses: string[] = [
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ];

  const getSeverity = (status: string): Severity => {
    switch (status) {
      case "unqualified":
        return "danger";
      case "qualified":
        return "success";
      case "new":
        return "info";
      case "negotiation":
        return "warning";
      case "renewal":
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    form.setFieldValue("patientId", String(user?.profileId ?? ""));
  }, [user]);

  useEffect(() => {
    setCustomers([
      {
        id: 1000,
        name: "James Butt",
        country: { name: "Algeria", code: "dz" },
        company: "Benton, John B Jr",
        date: new Date("2015-09-13"),
        status: "unqualified",
        verified: true,
        activity: 17,
        representative: { name: "Ioni Bowcher", image: "ionibowcher.png" },
        balance: 70663,
      },
      {
        id: 1001,
        name: "Josephine Darakjy",
        country: { name: "Egypt", code: "eg" },
        company: "Chanay, Jeffrey A Esq",
        date: new Date("2016-02-21"),
        status: "qualified",
        verified: false,
        activity: 42,
        representative: { name: "Amy Elsner", image: "amyelsner.png" },
        balance: 52340,
      },
      {
        id: 1002,
        name: "Art Venere",
        country: { name: "Brazil", code: "br" },
        company: "Chemel, James L Cpa",
        date: new Date("2017-06-18"),
        status: "new",
        verified: true,
        activity: 68,
        representative: { name: "Anna Fali", image: "annafali.png" },
        balance: 81250,
      },
      {
        id: 1003,
        name: "Lenna Paprocki",
        country: { name: "France", code: "fr" },
        company: "Feltz Printing Service",
        date: new Date("2018-11-05"),
        status: "negotiation",
        verified: false,
        activity: 29,
        representative: { name: "Elwin Sharvill", image: "elwinsharvill.png" },
        balance: 27480,
      },
      {
        id: 1004,
        name: "Donette Foller",
        country: { name: "Germany", code: "de" },
        company: "Printing Dimensions",
        date: new Date("2019-03-27"),
        status: "renewal",
        verified: true,
        activity: 84,
        representative: { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
        balance: 94510,
      },
      {
        id: 1005,
        name: "Simona Morasca",
        country: { name: "Italy", code: "it" },
        company: "Chapman, Ross E Esq",
        date: new Date("2020-08-14"),
        status: "qualified",
        verified: true,
        activity: 56,
        representative: { name: "Onyama Limba", image: "onyamalimba.png" },
        balance: 63890,
      },
    ]);

    const loadDoctors = async () => {
      setLoadingDoctors(true);

      try {
        const data = await getDoctorDropdown();

        const mappedDoctors: DoctorOption[] = (Array.isArray(data) ? data : [])
          .map((doctor: any, index: number) => {
            const value = String(
              doctor?.id ??
                doctor?.doctorId ??
                doctor?.value ??
                doctor?.code ??
                index,
            );

            const label = String(
              doctor?.doctorName ??
                doctor?.name ??
                doctor?.fullName ??
                doctor?.label ??
                `Doctor ${index + 1}`,
            );

            return { value, label };
          })
          .filter(
            (item) => item.value.trim() !== "" && item.label.trim() !== "",
          );

        setDoctorOptions(mappedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctorOptions([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  const formatDate = (value: Date) => {
    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      global: {
        value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    }));

    setGlobalFilterValue(value);
  };

  const handleOpenModal = () => {
    form.reset();
    form.setFieldValue("patientId", String(user?.profileId ?? ""));
    form.setFieldValue("appointmentTime", new Date());
    open();
  };

  const handleCloseModal = () => {
    form.reset();
    close();
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between gap-4">
        <Button leftSection={<IconPlus size={18} />} onClick={handleOpenModal}>
          Schedule Appointment
        </Button>

        <TextInput
          leftSection={<IconSearch size={16} />}
          w={320}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const header = renderHeader();

  const handleSubmit = (values: AppointmentFormValues) => {
    const rawAppointmentTime = values.appointmentTime;

    const parsedAppointmentTime =
      rawAppointmentTime instanceof Date
        ? rawAppointmentTime
        : rawAppointmentTime
          ? new Date(rawAppointmentTime)
          : null;

    const payload = {
      doctorId: Number(values.doctorId),
      patientId: Number(values.patientId),
      appointmentTime:
        parsedAppointmentTime && !Number.isNaN(parsedAppointmentTime.getTime())
          ? new Date(
              parsedAppointmentTime.getTime() -
                parsedAppointmentTime.getTimezoneOffset() * 60000,
            )
              .toISOString()
              .slice(0, 19)
          : null,
      reason: values.reason,
      notes: values.notes,
    };

    console.log("Appointment scheduled with values:", payload);
    setLoading(true);

    scheduleAppointment(payload)
      .then((data: any) => {
        close();
        form.reset();
        successNotification("Appointment scheduled successfully");
        console.log("Appointment scheduled successfully:", data);
      })
      .catch((error: any) => {
        errorNotification(
          error?.response?.data?.errorMessage ||
            "Failed to schedule appointment",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const countryBodyTemplate = (rowData: Customer) => {
    return (
      <div className="flex items-center gap-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: "24px" }}
        />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData: Customer) => {
    const representative = rowData.representative;

    return (
      <div className="flex items-center gap-2">
        <img
          alt={representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
          width="32"
        />
        <span>{representative.name}</span>
      </div>
    );
  };

  const representativesItemTemplate = (option: Representative) => {
    return (
      <div className="flex items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  const representativeFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <>
        <div className="mb-3 font-bold">Agent Picker</div>
        <MultiSelect
          value={options.value}
          options={representatives}
          itemTemplate={representativesItemTemplate}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };

  const dateBodyTemplate = (rowData: Customer) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={(options.value as Date | null) ?? null}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const balanceBodyTemplate = (rowData: Customer) => {
    return formatCurrency(rowData.balance);
  };

  const balanceFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <InputNumber
        value={(options.value as number | null) ?? null}
        onValueChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const statusFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const activityBodyTemplate = (rowData: Customer) => {
    return (
      <ProgressBar
        value={rowData.activity}
        showValue={false}
        style={{ height: "6px" }}
      />
    );
  };

  const activityFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    const rawValue = options.value;

    const sliderValue: [number, number] =
      Array.isArray(rawValue) &&
      rawValue.length === 2 &&
      typeof rawValue[0] === "number" &&
      typeof rawValue[1] === "number"
        ? [rawValue[0], rawValue[1]]
        : [0, 100];

    return (
      <>
        <Slider
          value={sliderValue}
          onChange={(e) => options.filterCallback(e.value)}
          range
          className="m-3"
        />
        <div className="flex items-center justify-between px-2">
          <span>{sliderValue[0]}</span>
          <span>{sliderValue[1]}</span>
        </div>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Customer) => {
    return (
      <Button
        size="xs"
        variant="light"
        onClick={() => {
          console.log("View row:", rowData);
          handleOpenModal();
        }}>
        View
      </Button>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={customers as any[]}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCustomers}
        onSelectionChange={(e: any) => setSelectedCustomers(e.value || [])}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "name",
          "country.name",
          "representative.name",
          "balance",
          "status",
        ]}
        emptyMessage="No customers found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        <Column
          field="name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="country.name"
          header="Country"
          sortable
          filterField="country.name"
          style={{ minWidth: "14rem" }}
          body={countryBodyTemplate}
          filter
          filterPlaceholder="Search by country"
        />

        <Column
          header="Agent"
          sortable
          sortField="representative.name"
          filterField="representative"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={representativeBodyTemplate}
          filter
          filterElement={representativeFilterTemplate}
        />

        <Column
          field="date"
          header="Date"
          sortable
          filterField="date"
          dataType="date"
          style={{ minWidth: "12rem" }}
          body={dateBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />

        <Column
          field="balance"
          header="Balance"
          sortable
          dataType="numeric"
          style={{ minWidth: "12rem" }}
          body={balanceBodyTemplate}
          filter
          filterElement={balanceFilterTemplate}
        />

        <Column
          field="status"
          header="Status"
          sortable
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusFilterTemplate}
        />

        <Column
          field="activity"
          header="Activity"
          sortable
          showFilterMatchModes={false}
          style={{ minWidth: "12rem" }}
          body={activityBodyTemplate}
          filter
          filterElement={activityFilterTemplate}
        />

        <Column
          header="Action"
          headerStyle={{ width: "8rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>

      <Modal
        opened={opened}
        size="lg"
        onClose={handleCloseModal}
        title={
          <div className="text-xl font-semibold text-primary-500">
            Schedule Appointment
          </div>
        }
        centered>
        <div className="relative p-5">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-5">
            <Select
              {...form.getInputProps("doctorId")}
              withAsterisk
              data={doctorOptions}
              label="Doctor"
              placeholder="Select Doctor"
              searchable
              clearable
              nothingFoundMessage="No doctors found"
            />

            <DateTimePicker
              minDate={new Date()}
              {...form.getInputProps("appointmentTime")}
              withAsterisk
              label="Appointment Time"
              placeholder="Pick date and time"
            />

            <Select
              {...form.getInputProps("reason")}
              data={appointmentReasons}
              withAsterisk
              label="Reason for Appointment"
              placeholder="Enter reason for appointment"
            />

            <Textarea
              {...form.getInputProps("notes")}
              label="Additional Notes"
              placeholder="Enter any additional notes"
              minRows={3}
            />

            <Button type="submit" variant="filled" fullWidth>
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Appointment;
