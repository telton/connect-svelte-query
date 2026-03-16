{
  description = "Flake for the connect-svelte-query repo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];

    forAllSystems = f:
      nixpkgs.lib.genAttrs systems (system:
        f (import nixpkgs { inherit system; }));
  in
  {
    devShells = forAllSystems (pkgs:
    {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nil
          nixd

          nodejs_24
          pnpm
          typescript-language-server
        ];

        shellHook = ''
          echo "Using Node $(node -v)"
          echo "Using pnpm $(pnpm -v)"
        '';
      };
    });
  };
}
