import click

@click.command(help="命令行界的 Hello World!")
def hello():
    click.echo('Hello World!')

if __name__ == '__main__':
    hello()