const ip_address = "192.168.3.16";

export const local_host = ip_address !== "192.168.3.16" ? "http://" + ip_address + ":3010/api/collections" : "http://localhost:3010/api/collections";
// export const local_host = "https://api.aixgoam.com/api/collections";
