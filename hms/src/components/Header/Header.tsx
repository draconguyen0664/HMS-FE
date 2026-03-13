import { ActionIcon, Button } from "@mantine/core";
import {
  IconBellRinging,
  IconLayoutSidebarLeftCollapseFilled,
} from "@tabler/icons-react";
import ProfileMenu from "./ProfileMenu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full h-16 flex items-center justify-between bg-light shadow-lg px-4 ">
      <ActionIcon variant="transparent" size="md" aria-label="Settings">
        <IconLayoutSidebarLeftCollapseFilled
          style={{ width: "90%", height: "90%" }}
          stroke={1.5}
        />
      </ActionIcon>
      <div className="flex gap-5 items-center">
        <Link to="login">
          <Button>Login</Button>
        </Link>
        <ActionIcon variant="transparent" size="md" aria-label="Settings">
          <IconBellRinging
            style={{ width: "90%", height: "90%" }}
            stroke={1.5}
          />
        </ActionIcon>
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
