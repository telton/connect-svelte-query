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
          
          # Patch Biome binary for NixOS if it exists
          BIOME_BIN="node_modules/.pnpm/@biomejs+cli-linux-x64@*/node_modules/@biomejs/cli-linux-x64/biome"
          if [ -f $BIOME_BIN ]; then
            patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" $BIOME_BIN 2>/dev/null || true
          fi
        '';
      };
    });
  };
}
