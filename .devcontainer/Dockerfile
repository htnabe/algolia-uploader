FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

LABEL maintainer="htnabe"

ARG username=notRoot
ARG useruid=1234
ARG usergid=${useruid}

RUN apt-get update && apt-get autoclean && apt-get autoremove && apt-get install -y \
  procps curl file git golang-go sudo\
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# create user
RUN groupadd --gid $usergid $username \
  && useradd --uid $useruid --gid $usergid -m $username \
  # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
  && echo $username ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$username \
  && chmod 0440 /etc/sudoers.d/$username

# set environmental variables
USER ${username}
